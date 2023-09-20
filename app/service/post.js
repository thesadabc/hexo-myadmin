import request from "./_request";

export default {
    list({page, title, category, tag}) {
        const params = {page, title, category, tag};
        return request.get("post", {params});
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
    publish(id) {
        return request.post(`post/${id}/publish`);
    },
    unpublish(id) {
        return request.post(`post/${id}/unpublish`);
    },
};