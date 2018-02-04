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
    var _loadResource = function (key, success) {
        var type = _getFiletype(key);
        var loader = resource[type];
        if (loader && loader.cache) {
            if (loader.cache[key]) {
                if (typeof success === 'function') {
                    if (loader.cache[key] === 1) {
                        $(document).one(key, success);
                    } else if (loader.cache[key] === 2) {
                        success();
                    }
                }
            } else {
                $(document).one(key, success);
                loader.cache[key] = 1;
                loader.load(key).then(
                    function () {
                        $(document).trigger(key, []);
                    },
                    function () {
                        window.console.log('load error: ' + key);
                    }
                );
            }
        } else {
            window.console.log('do not support load' + type);
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
                _loadResource(item, opt.callback);
            });
        }
    };

})(jQuery);