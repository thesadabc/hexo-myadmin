module.exports = {
    list(query) {
        return axios.get("pages", {"params": query});
    },
    detail(id) {
        return axios.get("pages/" + id);
    },
    raw(id) {
        return axios.get("pages/" + id + "/raw");
    },
    update(id, post) {
        return axios.put("pages/" + id, post);
    },
    create(post) {
        return axios.post("pages", post);
    },
    delete(id) {
        return axios.delete("pages/" + id);
    },
};
