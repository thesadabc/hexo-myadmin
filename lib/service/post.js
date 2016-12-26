let util = require('hexo-util');
let path = require("path");
let fs = require('hexo-fs');
let hfm = require('hexo-front-matter');

module.exports = class PostService {

    /**
     *  @param  hexo hexo instance
     *  @param  type [Post, Page]
     */
    constructor(hexo, type) {
        if (type !== "Post" && type !== "Page") throw "Modle Type should be Post or Page!";
        this.hexo = hexo;
        this.type = type;
    }

    /**
     *  @param  fullPath "/home/www/blog/source/_posts/hello.md"
     *  @return source "_posts/hello.md"
     */
    getSource(fullPath) {
        return fullPath.slice(this.hexo.source_dir.length).replace(/\\/g, '\/');
    }

    /**
     *  @return Promise
     */
    updateDB() {
        return this.hexo.source.process();
    }

    /**
     *  @return post array
     */
    list() {
        return this.hexo.model(this.type).sort("date", -1).toArray();
    }

    /**
     *  @param  postId or query
     *  @return post detail
     */
    detail(query) {
        let post = null;
        if (typeof(query) === "string") {
            post = this.hexo.model(this.type).findById(query);
        } else {
            post = this.hexo.model(this.type).findOne(query);
        }
        return post;
    }

    /**
     *  @param  postId or query
     *  @return post raw
     *          -  data
     *          -  content
     */
    raw(query) {
        let post = this.detail(query);
        if (!post) return null;
        return hfm.split(post.raw);
    }

    /**
     *  @param  newPost
     *          -  meta
     *          -  content
     *  @return  Promise newPost source
     */
    create({ meta, content }) {
        let compiled = hfm.parse(['---', meta, '---'].join('\n'));
        delete compiled._content;

        if (!compiled.title) return Promise.reject("title cant be null");

        compiled.updated = compiled.updated || new Date();
        compiled.content = content;
        compiled.author = this.hexo.config.author;
        compiled.layout = this.type.toLowerCase();

        if (this.type === "Post") {
            compiled.categories = compiled.categories || [this.hexo.config.default_category]
        }
        return this.hexo.post.create(compiled)
            .then((file) =>
                this.updateDB().then(() => this.getSource(file.path))
            );
    }

    /**
     *  @param  id
     *  @param  post
     *          -  meta
     *          -  content
     *  @return  Promise newPost source
     */
    update(id, { meta, content }) {
        let post = this.detail(id);

        let compiled = hfm.parse(['---', meta, '---', content].join('\n'));
        compiled.updated = compiled.updated || new Date();
        compiled.date = compiled.date || new Date(post.date.valueOf());
        compiled.author = compiled.author || post.author || this.hexo.config.author;
        if (this.type === "Post") {
            compiled.categories = compiled.categories || [this.hexo.config.default_category]
        }

        return fs.writeFile(post.full_source, hfm.stringify(compiled))
            .then(() => this.updateDB())
            .then(() => this.getSource(post.full_source));

    }

    /**
     *  @param  id
     *  @return Promise
     */
    delete(id) {
        let post = this.detail(id);
        if (this.type === "Page") {
            return fs.rmdir(path.dirname(post.full_source)).then(() => this.updateDB());
        } else if (this.type === "Post") {
            return fs.unlink(post.full_source).then(() => this.updateDB());
        }
    }

    /**
     *  @param  id
     *  @return Promise
     */
    publish(id) {
        if (this.type === "Page") return;
        let post = this.detail(id);
        let postDir = path.join(this.hexo.source_dir, '_posts');
        let newFullSource = path.join(postDir, path.basename(post.full_source));

        return fs.rename(post.full_source, newFullSource).then(() => this.updateDB());
    }

    /**
     *  @param  id
     *  @return Promise
     */
    unpublish(id) {
        if (this.type === "Page") return;
        let post = this.detail(id);
        let draftDir = path.join(this.hexo.source_dir, '_drafts');
        let newFullSource = path.join(draftDir, path.basename(post.full_source));

        return fs.exists(draftDir)
            .then((exists) => exists || fs.mkdir(draftDir))
            .then(() => fs.rename(post.full_source, newFullSource))
            .then(() => this.updateDB());
    }
}
