import request from "./_request";

export default {
    list(page) {
        return request.get("post", {"params":{page}});
    },
    detail(id) {
        return request.get(`post/${id}`);
    },
    raw(id) {
        return request.get(`post/${id}/raw`);
    },
    update(id, post) {
        return request.put(`post/${id}`, post);
    },
    create(post) {
        return request.post("post", post);
    },
    remove(id) {
        return request.delete(`post/${id}`);
    },
    publishPost(id) {
        return request.post(`post/${id}/publish`);
    },
    unPublishPost(id) {
        return request.post(`post/${id}/unpublish`);
    },
};