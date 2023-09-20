import request from "./_request";

export default {
    list({page, title, category, tag}) {
        const params = {page, title, category, tag};
        return request.get("page", {params});
    },
    detail(id) {
        return request.get(`page/${id}`);
    },
    raw(id) {
        return request.get(`page/${id}/raw`);
    },
    update(id, post) {
        return request.put(`page/${id}`, post);
    },
    create(post) {
        return request.post("page", post);
    },
    remove(id) {
        return request.delete(`page/${id}`);
    },
};