(function($) {
    $.CUI = {
        defaultContext: {
            $element: null,
            name: '',
            init: null,
            destroy: null,
            defaultOpt: null,
            options: null,
            exports: {},
            setOptionsBefore: null,
            setOptionsAfter: null,
            initBefore: null,
            initAfter: null,
            destroyBefore: null,
        },
        plugin: function(pluginContext) {
            var name = pluginContext.name;
            if ($.fn[name]) {
                window.console.log('the plugin name is duplicate: ' + name);
                return null;
            }

            $.fn[name] = function(options) {
                var $this = $(this);
                if (name && $this.data(name)) {
                    if (options) {
                        $this.data(name).setOptions(options);
                    }
                    return $this.data(name);
                }

                //initial context of plugin
                var context = $.extend(true, {
                    $element: $this,
                }, $.CUI.defaultContext, pluginContext);

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
            context.opt = $.extend(true, {}, context.defaultOpt, context.option);

            //handle the initial step
            $.proxy($.CUI.handleInit, that)(context);

            //add exports for the plugin
            $.proxy($.CUI.handleExports, that)(context);

            //initial export options of plugin
            context.exports.setOptions = $.proxy($.CUI.handleOptions, that)(context);

            //destroy export for the plugin
            context.exports.destroy = $.proxy($.CUI.handleDestroy, that)(context);

            return context.exports;
        },
        handleOptions: function(context) {
            var that = this;
            return function(options) {
                //before set options
                $.proxy(context.setOptionsBefore, that)(context, options);

                context.opt = $.extend(true, {}, context.opt, options);

                //after set options
                $.proxy(context.setOptionsAfter, that)(context, options);
            };
        },
        handleInit: function(context) {
            var that = this;
            var opt = context.opt;
            //before plugin initial event
            $.CUI.addEvent('cui.init.before.' + context.name, context);
            opt.initBefore && $.CUI.addEvent(opt.initBefore, context);
            //before plugin initial custom event
            context.initBefore && $.CUI.addEvent(context.initBefore, context);

            context.init && $.proxy(context.init, that)(context);

            //after plugin initial custom event
            context.initAfter && $.proxy(context.initAfter, that)(context);
            opt.initAfter && $.CUI.addEvent(opt.initAfter, context);

            //after plugin initial event
            $.CUI.addEvent('cui.init.after.' + context.name, context);
        },
        handleDestroy: function(context) {
            return function() {
                //before plugin destroy event
                $.CUI.addEvent('cui.before.destroy.' + context.name, context);
                //before plugin destroy custom event
                context.destroyBefore && $.CUI.addEvent(context.destroyBefore, context);
                context.$element.data(name, null);
            };
        },
        handleExports: function(context) {
            var that = this;
            if (context.exports) {
                var obj = {};
                $.each(context.exports, function(key, value) {
                    if ($.isFunction(value)) {
                        //export method for the plugin
                        obj[key] = function() {
                            var params = Array.prototype.slice.call(arguments);
                            params.push(context);
                            $.proxy(value, that).apply(that, params);
                        };
                    }
                });
                context.exports = obj;
            }
        },
        addEvent: function(name, context) {
            if ($.isFunction(name)) {
                name.apply(this, context.$element, context.opt);
            } else {
                $(document).trigger(name, [context.$element, context.opt]);
            }
        }
    };
})(jQuery);
