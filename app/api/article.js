import axios from "axios";

module.exports = function (type) {
    return {
        list(params) {
            return axios.get(type, {params});
        },
        detail(id) {
            return axios.get(`${type}/${id}`);
        },
        raw(id) {
            return axios.get(`${type}/${id}/raw`);
        },
        update(id, post) {
            return axios.put(`${type}/${id}`, post);
        },
        create(post) {
            return axios.post(type, post);
        },
        delete(id) {
            return axios.delete(`${type}/${id}`);
        },
        publishPost(id) {
            return axios.post(`post/${id}/publish`);
        },
        unpublishPost(id) {
            return axios.post(`post/${id}/unpublish`);
        },
    };

}