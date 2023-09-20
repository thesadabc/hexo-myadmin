import request from "./_request";

export default {
    getTagList(name) {
        return request.get("tag", {"params":{name}});
    },
    getCategoryList() {
        return request.get("category");
    },
};