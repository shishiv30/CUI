//seed code for create a plugin
//replace all of the "request" with the plugin name. (the plugin name should be same as the js file name);

(function($) {
    var requestConfig = {
        name: 'request',
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
        initAfter: null,
        destroyBefore: null
    };
    $.CUI.plugin(requestConfig);
    $(document).on('dom.load.request', function() {
        $('[data-request]').each(function(index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.removeAttr('data-request');
            $this.request(data);
            $this.attr('data-request-load', '');
        });
    });
})(jQuery);
