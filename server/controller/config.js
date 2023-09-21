"use strict";

module.exports = {
    async getConfig() {
        const config = await this.service.config.getConfig();
        this.res.send({config});
    },
    
    async updateConfig() {
        const {config} = this.req.body;
        if (config){
            await this.service.config.updateConfig(config);
        }
        this.res.send();
    },

    async getThemeConfig() {
        const config = await this.service.config.getThemeConfig();
        this.res.send({config});
    },

    async updateThemeConfig() {
        const {config} = this.req.body;
        if (config){
            await this.service.config.updateThemeConfig(config);
        }
        this.res.send();
    },
};
