module.exports = {
    list: function(query) {
        return axios.get("/posts", { params: query });
    },
    detail: function(id) {
        return axios.get("/posts/" + id);
    },
    raw: function(id) {
        return axios.get("/posts/" + id + "/raw");
    },
    update: function(id, post) {
        return axios.put("/posts/" + id, post);
    },
    create: function(post) {
        return axios.post("/posts", post);
    },
    delete: function(id) {
        return axios.delete("/posts/" + id);
    },
    publish: function(id) {
        return axios.post("/posts/" + id + "/publish");
    },
    unpublish: function(id) {
        return axios.post("/posts/" + id + "/unpublish");
    }
}
