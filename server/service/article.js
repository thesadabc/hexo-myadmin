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
        this.model = this.hexo.model(this.type);
    }

    /**
     *  @param  fullPath "/home/www/blog/source/_posts/hello.md"
     *  @return source "_posts/hello.md"
     */
    getSource(fullPath) {
        return fullPath.slice(this.hexo.source_dir.length).replace(/\\/g, "/");
    }

    /**
     *  @return doc array
     */
    list({category, title, tag}, page = 0, pageSize = 15) {
        return this.model.filter(i => 
            (!category || i.categories.some(c => c.name === category)) &&
                (!tag || i.tags.some(c => c.name === tag)) &&
                (!title || i.title.includes(title)),
        )
            .sort("date", -1)
            .skip(page * pageSize)
            .limit(pageSize);
    }

    /**
     *  @param  docId or query
     *  @return doc detail
     */
    detail(query) {
        if (typeof (query) === "string") {
            return this.model.findById(query);
        } else {
            return this.model.findOne(query);
        }
    }

    /**
     *  @param  docId or query
     *  @return doc raw
     *          -  data
     *          -  content
     */
    raw(query) {
        const doc = this.detail(query);
        if (!doc) return null;
        return hfm.split(doc.raw);
    }

    /**
     *  @param  newDoc
     *          -  meta
     *          -  content
     *  @return  newDoc
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
        await this.hexo.source.process();
        return this.detail({"source": this.getSource(file.path)});
    }

    /**
     *  @param  id
     *  @param  doc
     *          -  meta
     *          -  content
     *  @return  newDoc
     */
    async update(id, {meta, content}) {
        const doc = this.detail(id);

        const compiled = hfm.parse(["---", meta, "---", content].join("\n"));
        compiled.updated = compiled.updated || new Date();
        compiled.date = compiled.date || new Date(doc.date.valueOf());
        compiled.author = compiled.author || doc.author || this.hexo.config.author;
        if (this.type === "Post") {
            compiled.categories = compiled.categories || [this.hexo.config.default_category];
        }

        await fs.writeFile(doc.full_source, hfm.stringify(compiled));
        await this.hexo.source.process();
        return this.detail({"source": this.getSource(doc.full_source)});
    }

    /**
     *  @param  id
     *  @return
     */
    async delete(id) {
        const doc = this.detail(id);
        if (this.type === "Page") {
            await fs.rmdir(path.dirname(doc.full_source));
        } else if (this.type === "Post") {
            await fs.unlink(doc.full_source);
        }
        await this.hexo.source.process();
    }

    /**
     *  @param  id
     *  @return newDoc
     */
    async publish(id) {
        if (this.type === "Page") return;
        const doc = this.detail(id);
        const postDir = path.join(this.hexo.source_dir, "_posts");
        const fullSource = path.join(postDir, path.basename(doc.full_source));

        await fs.rename(doc.full_source, fullSource);
        await this.hexo.source.process();
        const source = this.getSource(fullSource);
        return this.detail({source});
    }

    /**
     *  @param  id
     *  @return newDoc
     */
    async unpublish(id) {
        if (this.type === "Page") return;
        const doc = this.detail(id);
        const draftDir = path.join(this.hexo.source_dir, "_drafts");
        const fullSource = path.join(draftDir, path.basename(doc.full_source));

        const exists = fs.exists(draftDir);
        if (!exists) await fs.mkdir(draftDir);
        await fs.rename(doc.full_source, fullSource);

        const source = this.getSource(fullSource);
        await this.hexo.source.process();
        return this.detail({source});
    }
};
