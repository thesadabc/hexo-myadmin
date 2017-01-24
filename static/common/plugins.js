var Alert = require("components/dialog/alert");
var Confirm = require("components/dialog/confirm");
var Loading = require("components/dialog/loading");

module.exports = function(Vue, option) {
    
    Vue.routeRefreshMixin = {
        watch: {
            "$route": function(r) {
                if (this._inactive) return;
                if(this.$options.routerRefresh)
                    this.$options.routerRefresh.call(this, this.$route);
            }
        },
        created: function() {
            this.$nextTick(function() {
                console.log(this)
                if(this.$options.routerRefresh)
                    this.$options.routerRefresh.call(this, this.$route);
            })
        },
    };

    Vue.alert = Vue.prototype.$alert = function(content) {
        return new Promise(function(resolve) {
            var _instance = new Alert({ data: { content: content } });
            _instance.$on("close", resolve);
            _instance.show();
        });
    };

    Vue.confirm = Vue.prototype.$confirm = function(content) {
        return new Promise(function(resolve, reject) {
            var _instance = new Confirm({ data: { content: content } });
            _instance.$once("confirm", function(confirm) {
                confirm && resolve()
            });
            _instance.show();
        });
    };

    var _loadingInstance = new Loading();
    Vue.loading = Vue.prototype.$loading = function() {
        _loadingInstance.start();
        var timeoutHandler = setTimeout(function() {
            _loadingInstance.stop();
        }, 10000);
        return function() {
            if (timeoutHandler) clearTimeout(timeoutHandler);
            _loadingInstance.stop();
        }
    };



    Vue.tools = Vue.prototype.$tools = {
        formatTime: function(value, fmt) {
            // moment(value).format("YYYY-MM-DD HH:mm")

            fmt = fmt || "YYYY-MM-DD HH:mm";
            var dateTime = new Date(+value);
            var o = {
                "M+": dateTime.getMonth() + 1, //月份 
                "D+": dateTime.getDate(), //日 
                "H+": dateTime.getHours(), //小时 
                "m+": dateTime.getMinutes(), //分 
                "s+": dateTime.getSeconds(), //秒 
                // "q+": Math.floor((dateTime.getMonth() + 3) / 3), //季度 
                // "S": dateTime.getMilliseconds() //毫秒 
            };
            if (/(Y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (dateTime.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        parseJson: function(jsonStr, def) {
            try {
                return JSON.parse(jsonStr);
            } catch (e) {
                return def || null;
            }
        }
    }
};
