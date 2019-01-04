module.exports = {
    list(query) {
        return axios.get("posts", {"params": query});
    },
    detail(id) {
        return axios.get("posts/" + id);
    },
    raw(id) {
        return axios.get("posts/" + id + "/raw");
    },
    update(id, post) {
        return axios.put("posts/" + id, post);
    },
    create(post) {
        return axios.post("posts", post);
    },
    delete(id) {
        return axios.delete("posts/" + id);
    },
    publish(id) {
        return axios.post("posts/" + id + "/publish");
    },
    unpublish(id) {
        return axios.post("posts/" + id + "/unpublish");
    },
};
