(function($) {
    $.CUI = {
        defaultContext: {
            name: '',
            $element: null,
            target: null,
            $trigger: null,
            init: null,
            destroy: null,
            method: [],
            resetOptionsBefore: null,
            resetOptionsAfter: null,
            initBefore: null,
            initAfter: null,
            showBefore: null,
            showAfter: null,
            hideBefore: null,
            hideAfter: null,
            destroyBefore: null,
        },
        create: function(name, plugin) {
            //initial context of plugin
            var context = $.extend({
                name: name,
                $element: plugin.$element || $(window),
                $trigger: plugin.$trigger || plugin.$element
            }, $.CUI.defaultContext);

            //initial export options of plugin
            $.CUI.handleOptions.apply(context);

            //handle the initial step
            $.CUI.handleInit.apply(context);

            //add methods for the plugin
            $.CUI.handleMethod.apply(context);

            //destroy method for the plugin
            $.CUI.handleDestroy.apply(context);

            return context;
        },
        handleOptions: function(context) {
            context.opt = $.extend(true, {}, context.defaultOpt, context.option);
            context.setOptions = function(options) {
                context.resetOptionsBefore(options, context);
                context.opt = $.extend(true, {}, context.opt, options);
                context.resetOptionsAfter(options, context);
            };
        },
        handleInit: function(context) {
            context.init = function() {
                //before plugin initial event
                $.CUI.addEvent('cui.init.before.' + name, [context]);

                //before plugin initial custom event
                context.initBefore && $.CUI.addEvent(context.initBefore, [context]);

                context.init && context.init.apply(context);

                //after plugin initial custom event
                context.initalAfter && $.CUI.addEvent(context.initalAfter, [context]);

                //after plugin initial event
                $.CUI.addEvent('cui.init.after.' + name, [context]);
            };
        },
        handleDestroy: function(context) {
            context.destroy = function() {
                //before plugin destroy event
                $.CUI.addEvent('cui.before.destroy.' + name, [context]);
                //before plugin destroy custom event
                context.destroyBefore && $.CUI.addEvent(context.destroyBefore, [context]);
                context.$element.data(name, null);
            };
        },
        handleMethod: function(context) {
            if (context.method && context.method.length) {
                var obj = {};
                $.each(context.method, function(key, value) {
                    if ($.isFunction(value)) {
                        obj[key, $.proxy(value, context)];
                    }
                });
                context.export = obj;
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


// var y= function (call){
//     var self = this;
//     var context = {
//         name: "conjee"
//     };
//     var call2 = function(){
//         call.apply(self ,[2]);
//         alert(3);
//     }
//     return call2;
// }
//
// var x =  y(function(e){alert(this.name); alert(e)});
// x();