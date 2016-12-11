module.exports = {
    list: function(query) {
        return axios.get("/pages", { params: query });
    },
    detail: function(id) {
        return axios.get("/pages/" + id);
    },
    raw: function(id) {
        return axios.get("/pages/" + id + "/raw");
    },
    update: function(id, post) {
        return axios.put("/pages/" + id, post);
    },
    create: function(post) {
        return axios.post("/pages", post);
    },
    delete: function(id) {
        return axios.delete("/pages/" + id);
    }
}
