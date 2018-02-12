//todo: somuch jquery dependency need to remove such as each
(function ($) {
    //1:loading //2load
    var resource = {
        js: {
            load: function (src) {
                return new Promise(function (resolve, reject) {
                    var script = document.createElement('script');
                    script.onload = resolve;
                    script.onerror = reject;
                    script.src = src;
                    document.getElementsByTagName('head')[0].appendChild(script);
                });
            },
            cache: {}
        },
        css: {
            load: function (src) {
                return new Promise(function (resolve, reject) {
                    var link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.href = src;
                    link.onload = resolve;
                    link.onerror = reject;
                    document.getElementsByTagName('head')[0].appendChild(link);
                });
            },
            cache: {}
        },
    };
    var _getFiletype = function (filename) {
        if (!filename) {
            return;
        }
        return filename.substring(filename.lastIndexOf('.') + 1, filename.length);
    };
    var _loadResource = function (url, filetype, success) {
        var type = filetype || _getFiletype(url);
        var loader = resource[type];
        if (loader && loader.cache) {
            if (loader.cache[url]) {
                if (typeof success === 'function') {
                    if (loader.cache[url] === 1) {
                        $(document).one(url, success);
                    } else if (loader.cache[url] === 2) {
                        success();
                    }
                }
            } else {
                $(document).one(url, success);
                loader.cache[url] = 1;
                loader.load(url).then(
                    function () {
                        $(document).trigger(url, []);
                    },
                    function () {
                        /*eslint no-console: ["error", { allow: ["log"] }] */
                        console.log('load error: ' + url);
                    }
                );
            }
        } else {
            /*eslint no-console: ["error", { allow: ["log"] }] */
            console.log('do not support load' + type);
        }
    };
    $.preload = function (options) {
        var defaultOpt = {
            files: [],
            callback: null
        };
        var opt = $.extend(defaultOpt, options);
        if (opt.files && opt.files.length) {
            opt.files.forEach(function (item) {
                _loadResource(item, opt.type, opt.callback);
            });
        }
    };

})(jQuery);
