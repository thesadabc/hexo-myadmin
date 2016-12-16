var dialog = require("./components/dialog");

module.exports.install = function(Vue, option) {

    Vue.alert = function(content) {
        return new Promise(function(resolve) {
            var _instance = new dialog.Alert({ data: { content: content } });
            _instance.$on("close", resolve);
        });
    };

    Vue.confirm = function(content) {
        return new Promise(function(resolve, reject) {
            var _instance = new dialog.Confirm({ data: { content: content } });
            _instance.$on("confirm", resolve);
        });
    };

    var _loadingInstance = new dialog.Loading();
    Vue.loading  = function() {
        _loadingInstance.start();
        var timeoutHandler = setTimeout(function() {
            _loadingInstance.stop();
        }, 10000);
        return function() {
            if (timeoutHandler) clearTimeout(timeoutHandler);
            _loadingInstance.stop();
        }
    };


    Vue.tools = {
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
        serialize: function(obj) {
            return Object.keys(obj).map(function(k) {
                return k + "=" + obj[k];
            }).join("&");
        },
        parseJson: function(jsonStr, def) {
            try {
                return JSON.parse(jsonStr);
            } catch (e) {
                return def || null;
            }
        },
        clone: function(obj) {
            if (typeof(obj) !== "object") return obj;
            return JSON.parse(JSON.stringify(obj));
        },
        toArray: function(o) {
            return Array.prototype.slice.call(o);
        }
    }
};
