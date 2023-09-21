"use strict";

const {join} = require("path");
const {exists, readFile, writeFile} = require("hexo-fs");
const loadConfig = require("hexo/lib/hexo/load_config");
const loadThemeConfig = require("hexo/lib/hexo/load_theme_config");

module.exports = class ConfigService {
    /**
     *  @param  hexo hexo instance
     */
    constructor(hexo, type) {
        this.hexo = hexo;
        this.model = this.hexo.model(type);
    }

    async getConfig() {
        const configPath = this.hexo.config_path;
        if (await exists(configPath)){
            return readFile(configPath);
        }
    }

    async updateConfig(data){
        const configPath = this.hexo.config_path;
        await writeFile(configPath, data);

        await loadConfig(this.hexo);
        await this.hexo.load();
    }

    async getThemeConfig(){
        let configPath = join(this.hexo.base_dir,
            `_config.${this.hexo.config.theme}.yml`);
        if (!await exists(configPath)){
            configPath = join(this.hexo.base_dir,
                `./themes/${this.hexo.config.theme}/_config.yml`);
        }
        return readFile(configPath);
    }

    async updateThemeConfig(data){
        const configPath = join(this.hexo.base_dir,
            `_config.${this.hexo.config.theme}.yml`);
        await writeFile(configPath, data);

        // hexo/lib/hexo/load_theme_config.js
        const baseConfig = this.hexo.render.render({"path": this.hexo.config_path});
        this.hexo.config.theme_config = baseConfig.theme_config;
        await loadThemeConfig(this.hexo);
        await this.hexo.load();
    }
};
