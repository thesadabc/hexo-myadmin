import request from "./_request";

export default {
    login({username, password}) {
        return request.post("login", {username, password});
    },
};