//todo: somuch jquery dependency need to remove such as each
/*eslint no-console: ["error", { allow: ["log"] }] */
(function ($) {
    var resource = {
        js: {
            load: function (src, callback) {
                var dfd = $.Deferred();
                var script = document.createElement('script');
                if(callback) {
                    window[callback] = function () {
                        dfd.resolve();
                    };
                } else {
                    script.onload = dfd.resolve;
                    script.onerror = dfd.reject;
                }
                script.src = src;
                document.getElementsByTagName('head')[0].appendChild(script);
                return dfd;
            },
            cache: {}
        },
        css: {
            load: function (src) {
                var dfd = $.Deferred();
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = src;
                link.onload = dfd.resolve;
                link.onerror = dfd.reject;
                return dfd;
            },
            cache: {}
        },
    };
    var _getFiletype = function (filename) {
        if(!filename) {
            return;
        }
        return filename.substring(filename.lastIndexOf('.') + 1, filename.length);
    };
    var _loadResource = function (url, filetype, callback) {
        var type = filetype || _getFiletype(url);
        var loader = resource[type];
        if(loader && loader.cache) {
            if(loader.cache[url]) {
                console.log('cache');
                return true;
            } else {
                loader.cache[url] = true;
                return loader.load(url, callback);
            }
        } else {
            console.log('do not support load' + type);
            return false;
        }
    };
    $.preload = function (options) {
        var defaultOpt = {
            files: []
        };
        var opt = $.extend(defaultOpt, options);
        var resources = [];
        if(opt.files && opt.files.length) {
            opt.files.forEach(function (item) {
                resources.push(_loadResource(item, opt.type, opt.callback));
            });
        }
        return Promise.all(resources);
    };
    $.getPreLoadFiles = function (key) {
        var cache = [];
        switch(key) {
        case 'js':
            $.each(resource.js.cache, function (key) {
                cache.push(key);
            });
            break;
        case 'css':
            $.each(resource.css.cache, function (key) {
                cache.push(key);
            });
            break;
        default:
            $.each(resource.js.cache, function (key) {
                cache.push(key);
            });
            $.each(resource.css.cache, function (key) {
                cache.push(key);
            });
            break;
        }
        return cache;
    };
})(jQuery);
