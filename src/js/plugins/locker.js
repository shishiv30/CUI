//seed code for create a plugin
//replace all of the "locker" with the plugin name. (the plugin name should be same as the js file name);

(function ($) {
    var lockerConfig = {
        name: 'locker',
        defaultOpt: {
            onbeforelock: null,
            onafterlock: null,
            onbeforeunlock: null,
            onafterunlock: null
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            context._lock = function () {
                opt.onbeforelock && $.CUI.trigger(opt.onbeforelock, $this);
                $this.addClass('locked');
                opt.onafterlock && $.CUI.trigger(opt.onafterlock, $this);
            };
            context._unlock = function () {
                opt.onbeforeunlock && $.CUI.trigger(opt.onbeforeunlock, $this);
                $this.removeClass('locked');
                opt.onafterunlock && $.CUI.trigger(opt.onafterunlock, $this);
            };
        },
        exports: {
            lock: function () {
                this._lock();
            },
            unlock: function () {
                this._unlock();
            }
        },
        setOptionsBefore: null,
        setOptionsAfter: null,
        initBefore: null,
        initAfter: function (context) {
            var exports = context.exports;
            exports.lock();
        },
        destroyBefore: null
    };
    $.CUI.plugin(lockerConfig);
    $(document).on('dom.load.locker', function () {
        $('[data-locker]').each(function (index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.removeAttr('data-locker');
            $this.locker(data);
            $this.attr('data-locker-load', '');
            $this.attr('role', 'locker');
        });
    });
})(jQuery);