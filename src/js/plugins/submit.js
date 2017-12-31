//seed code for create a plugin
//replace all of the "submit" with the plugin name. (the plugin name should be same as the js file name);

(function($) {
    var submitConfig = {
        name: 'submit',
        defaultOpt: {
            target: '',
            type: null,
            beforesend: null,
            onsuccess: null,
            onerror: null,
            datatype: null,
            lock: 1,
        },
        init: function(context) {
            var opt = context.opt;
            var $this = context.$element;
            var $target = context.$target = $(opt.target);
            var send= function() {
                var params = {
                    type: opt.type,
                    dataType: opt.datatype,
                    lock: opt.lock
                };
                if ($target) {
                    if ($target.isValid()) {
                        params.data = $target.getValue();
                    } else {
                        return false;
                    }
                }
                params.beforeSend = function() {
                    if ($.isFunction(opt.beforesend)) {
                        opt.beforesend(opt);
                    } else {
                        $(document).trigger(opt.beforesend, [opt]);
                    }
                };
                params.success = function() {
                    if ($.isFunction(opt.onsuccess)) {
                        opt.onsuccess(opt);
                    } else {
                        $(document).trigger(opt.onsuccess, [$this, opt]);
                    }
                };
                params.error = function() {
                    if ($.isFunction(opt.onerror)) {
                        opt.onerror(opt);
                    } else {
                        $(document).trigger(opt.onerror, [$this, opt]);
                    }
                };
                $.ajax(params);
            };
            $this.click(send);
        },

        setOptionsBefore: null,
        setOptionsAfter: null,
        initBefore: null,
        initAfter: function(context) {
            var $this = context.$element;
            var $target = context.$target;
            var opt = context.opt;
            var exports = context.exports;

        },
        destroyBefore: function(context) {
            var $this = context.$element;
        }
    };
    $.CUI.plugin(submitConfig);
    $(document).on('dom.load.submit', function() {
        $('[data-submit]').each(function(index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.submit(data);
            $this.removeAttr('data-submit');
            $this.attr('data-submit-load', '');
            $this.attr('role', 'submit');
        });
    });
})(jQuery);
