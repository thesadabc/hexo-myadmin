const Alert = require("components/dialog/alert");
const Confirm = require("components/dialog/confirm");
const Loading = require("components/dialog/loading");

module.exports = function (Vue, option) {
    Vue.routeRefreshMixin = {
        "watch": {
            $route(r) {
                if (this._inactive) return;
                if (this.$options.routerRefresh) { this.$options.routerRefresh.call(this, this.$route); }
            },
        },
        created() {
            this.$nextTick(function () {
                console.log(this);
                if (this.$options.routerRefresh) { this.$options.routerRefresh.call(this, this.$route); }
            });
        },
    };

    Vue.alert = Vue.prototype.$alert = function (content) {
        return new Promise(function (resolve) {
            const _instance = new Alert({"data": {content}});
            _instance.$on("close", resolve);
            _instance.show();
        });
    };

    Vue.confirm = Vue.prototype.$confirm = function (content) {
        return new Promise(function (resolve, reject) {
            const _instance = new Confirm({"data": {content}});
            _instance.$once("confirm", function (confirm) {
                confirm && resolve();
            });
            _instance.show();
        });
    };

    const _loadingInstance = new Loading();
    Vue.loading = Vue.prototype.$loading = function () {
        _loadingInstance.start();
        const timeoutHandler = setTimeout(function () {
            _loadingInstance.stop();
        }, 10000);
        return function () {
            if (timeoutHandler) clearTimeout(timeoutHandler);
            _loadingInstance.stop();
        };
    };

    Vue.tools = Vue.prototype.$tools = {
        formatTime(date, format = "yyyy-MM-dd hh:mm:ss") {
            date = new Date(date);
            const map = {"M": date.getMonth() + 1, "d": date.getDate(), "h": date.getHours(), "m": date.getMinutes(), "s": date.getSeconds(), "q": Math.floor((date.getMonth() + 3) / 3), "S": date.getMilliseconds(), "y": date.getFullYear()};
            return format.replace(/([yMdhmsqS])+/g, (all, t) => (map[t] + "").padStart(all.length, "0").slice(-all.length));
        },
        parseJson(jsonStr, def) {
            try {
                return JSON.parse(jsonStr);
            } catch (e) {
                return def || null;
            }
        },
    };
};
