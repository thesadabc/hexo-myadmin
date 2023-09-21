import request from "./_request";

export default {
    getConfig() {
        return request.get("config");
    },
    
    updateConfig(config) {
        return request.post("config", {config});
    },

    getThemeConfig() {
        return request.get("themeconfig");
    },
    
    updateThemeConfig(config) {
        return request.post("themeconfig", {config});
    },
};