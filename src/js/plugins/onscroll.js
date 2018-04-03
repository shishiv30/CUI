//lazy load image
//seed code for create a plugin
//replace all of the "onscroll" with the plugin name. (the plugin name should be same as the js file name);
(function ($) {
    var onscrollConfig = {
        name: 'onscroll',
        defaultOpt: {
            callback: null,
            params: null,
            reserve: 0,
            once: true
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            var eventName = 'dom.scroll.' + $.guid++;
            var _checkScreen = function (ignoreCache) {
                if(opt.callback) {
                    var scrolltop = $(window).scrollTop();
                    var wheight = $(window).height();
                    var offsetTop = $this.offset().top;
                    if(offsetTop >= scrolltop && offsetTop <= (scrolltop + wheight + (ignoreCache === true ? 0 : opt.reserve))) {
                        $.CUI.trigger(opt.callback, [opt.params]);
                        if(opt.once) {
                            opt.callback = null;
                            $(document).off(eventName);
                        }
                    }
                }
            };
            $(document).on(eventName, function () {
                _checkScreen();
            });
            _checkScreen(true);
        },
        exports: null,
        setOptionsBefore: null,
        setOptionsAfter: null,
        initBefore: null,
        initAfter: null,
        destroyBefore: null
    };
    $.CUI.plugin(onscrollConfig);
    $(document).on('dom.load.onscroll', function () {
        $('[data-onscroll]').each(function (index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.removeAttr('data-onscroll');
            $this.onscroll(data);
            $this.attr('data-onscroll-load', '');
        });
    });
})(jQuery);
