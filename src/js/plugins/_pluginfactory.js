(function($) {
    $.CUI = {
        plugin: function(pluginContext) {
            var name = pluginContext.name;
            if ($.fn[name]) {
                window.console.log('the plugin is exists: ' + name);
                return null;
            }

            $.fn[name] = function(options) {
                var $this = $(this);
                var cache = $this.data(name);
                if (cache && typeof (cache) !== 'string') {
                    if (options) {
                        cache.setOptions && cache.setOptions(options);
                    }
                    return cache;
                }

                //initial context of plugin
                var context = $.extend({
                    $element: $this,
                    name: '',
                    defaultOpt: null,
                    initBefore: null,
                    init: null,
                    exports: {},
                    setOptionsBefore: null,
                    setOptionsAfter: null,
                    destroyBefore: null,
                    initAfter: null,
                    isThirdPart: false,
                }, pluginContext);

                context.options = options;
                context.$element = $this;

                var obj = $.proxy($.CUI.create, this)(context);

                $this.data(name, obj);

                return obj;
            };
        },
        create: function(context) {
            var that = this;
            //initial export options of plugin
            context.opt = $.extend(true, {}, context.defaultOpt, context.options);
            //handle the initial step
            $.proxy($.CUI.handleInit, that)(context);

            return context.exports;
        },
        handleOptions: function(context) {
            var that = this;
            return function(options) {
                //before set options
                context.setOptionsBefore && $.proxy(context.setOptionsBefore, that)(context, options);

                context.opt = $.extend(context.opt, options);

                //after set options
                context.setOptionsAfter && $.proxy(context.setOptionsAfter, that)(context, options);
            };
        },
        handleInit: function(context) {
            var that = this;
            var opt = context.opt;
            var exports = context.exports;
            //before plugin initial event
            $.CUI.addEvent('cui.init.before.' + context.name, context);
            opt.initbefore && $.CUI.addEvent(opt.initbefore, context);

            //before plugin initial custom event
            context.initBefore && $.CUI.addEvent(context.initBefore, context);

            context.init && $.proxy(context.init, that)(context);

            //is third part plugin
            if (context.isThirdPart && context.exports.original) {
                context.exports.original = $.isFunction(context.exports.original) ? $.proxy(context.exports.original, context)() : context.exports.original;
            } else {
                //add exports for the plugin
                $.proxy($.CUI.handleExports, that)(context);
                //initial get options of plugin
                context.exports.getOptions = function() {
                    return opt;
                };

                //initial set options of plugin
                context.exports.setOptions = $.proxy($.CUI.handleOptions, that)(context);

                //destroy export for the plugin
                context.exports.destroy = $.proxy($.CUI.handleDestroy, that)(context);
            }
            console.log(context.name);
            //after plugin initial custom event
            context.initAfter && $.proxy(context.initAfter, that)(context);
            opt.initafter && $.CUI.addEvent(opt.initafter, context);

            //after plugin initial event
            $.CUI.addEvent('cui.init.after.' + context.name, context);
        },
        handleDestroy: function(context) {
            var that = this;
            return function() {
                //before plugin destroy event
                $.CUI.addEvent('cui.before.destroy.' + context.name, context);
                //before plugin destroy custom event
                $.proxy(context.destroyBefore, that)(context);
                context.$element.data(context.name, null);
            };
        },
        handleExports: function(context) {
            if (context.exports) {
                var obj = {};
                $.each(context.exports, function(key, value) {
                    if ($.isFunction(value)) {
                        //export method for the plugin
                        obj[key] = $.proxy(value, context);
                    }
                });
                obj.name = context.name;
                context.exports = obj;
            }
        },
        addEvent: function(name, context) {
            var params = [context.$element, context.exports];
            var array = Array.prototype.slice.call(arguments);
            params.concat(array.slice(2, array.length));
            if ($.isFunction(name)) {
                name.apply(this, params);
            } else {
                $(document).trigger(name, params);
            }
        },
        loadJs: function() {

        }
    };
})(jQuery);
