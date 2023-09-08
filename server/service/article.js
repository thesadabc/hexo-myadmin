"use strict";

const path = require("path");
const fs = require("hexo-fs");
const hfm = require("hexo-front-matter");

module.exports = class ArticleService {
    /**
     *  @param  hexo hexo instance
     *  @param  type [Post, Page]
     */
    constructor(hexo, type) {
        if (type !== "Post" && type !== "Page") {
            throw new Error("Modle Type should be Post or Page!");
        }
        this.hexo = hexo;
        this.type = type;
    }

    /**
     *  @param  fullPath "/home/www/blog/source/_posts/hello.md"
     *  @return source "_posts/hello.md"
     */
    getSource(fullPath) {
        return fullPath.slice(this.hexo.source_dir.length).replace(/\\/g, "/");
    }

    /**
     *  @return
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
        if (typeof (query) === "string") {
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
        const post = this.detail(query);
        if (!post) return null;
        return hfm.split(post.raw);
    }

    /**
     *  @param  newPost
     *          -  meta
     *          -  content
     *  @return  newPost source
     */
    async create({meta, content}) {
        const compiled = hfm.parse(["---", meta, "---"].join("\n"));
        delete compiled._content;

        if (!compiled.title) throw new Error("title cant be null");

        compiled.updated = compiled.updated || new Date();
        compiled.content = content;
        compiled.author = this.hexo.config.author;
        compiled.layout = this.type.toLowerCase();

        if (this.type === "Post") {
            compiled.categories = compiled.categories || [this.hexo.config.default_category];
        }
        const file = await this.hexo.post.create(compiled);
        await this.updateDB();
        return this.getSource(file.path);
    }

    /**
     *  @param  id
     *  @param  post
     *          -  meta
     *          -  content
     *  @return  newPost source
     */
    async update(id, {meta, content}) {
        const post = this.detail(id);

        const compiled = hfm.parse(["---", meta, "---", content].join("\n"));
        compiled.updated = compiled.updated || new Date();
        compiled.date = compiled.date || new Date(post.date.valueOf());
        compiled.author = compiled.author || post.author || this.hexo.config.author;
        if (this.type === "Post") {
            compiled.categories = compiled.categories || [this.hexo.config.default_category];
        }

        await fs.writeFile(post.full_source, hfm.stringify(compiled));
        await this.updateDB();
        return this.getSource(post.full_source);
    }

    /**
     *  @param  id
     *  @return
     */
    async delete(id) {
        const post = this.detail(id);
        if (this.type === "Page") {
            await fs.rmdir(path.dirname(post.full_source));
        } else if (this.type === "Post") {
            await fs.unlink(post.full_source);
        }
        await this.updateDB();
    }

    /**
     *  @param  id
     *  @return
     */
    async publish(id) {
        if (this.type === "Page") return;
        const post = this.detail(id);
        const postDir = path.join(this.hexo.source_dir, "_posts");
        const newFullSource = path.join(postDir, path.basename(post.full_source));

        await fs.rename(post.full_source, newFullSource);
        await this.updateDB();
    }

    /**
     *  @param  id
     *  @return
     */
    async unpublish(id) {
        if (this.type === "Page") return;
        const post = this.detail(id);
        const draftDir = path.join(this.hexo.source_dir, "_drafts");
        const newFullSource = path.join(draftDir, path.basename(post.full_source));

        const exists = fs.exists(draftDir);
        if (!exists) await fs.mkdir(draftDir);
        await fs.rename(post.full_source, newFullSource);
        await this.updateDB();
    }
};
