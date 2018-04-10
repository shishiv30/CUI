//seed code for create a plugin
//replace all of the "scrollto" with the plugin name. (the plugin name should be same as the js file name);

(function ($) {
    var scrolltoConfig = {
        name: 'scrollto',
        defaultOpt: {
            target: null,
            offsettop: null,
            scrollbefore: null,
            container: null,
            scrollafter: null
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            $this.click(function () {
                opt.scrollbefore&&  $.CUI.trigger(opt.scrollbefore, this);
                $.scrollTo(opt.target, $(opt.container), opt.offsettop);
                opt.scrollafter&&  $.CUI.trigger(opt.scrollafter, this);
            });
        },
        exports: null,
        setOptionsBefore: null,
        setOptionsAfter: null,
        initBefore: null,
        initAfter: null,
        destroyBefore: null
    };
    $.CUI.plugin(scrolltoConfig);
    $(document).on('dom.load.scrollto', function () {
        $('[data-scrollto]').each(function (index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.scrollto(data);
            $this.removeAttr('data-scrollto');
            $this.attr('data-scrollto-load', '');
        });
    });
})(jQuery);

(function ($) {
    $(document).on('dom.scroll.scrollSpy', function () {
        var status = $.CUI.status;
        $('[data-scrollspy]').each(function () {
            var $item = $(this);
            var offset = $($item.attr('data-offsettop'));
            var target = $($item.data('target'));
            var top = offset ? (status.scrollTop + offset.height()) : status.scrollTop;
            top += 50;
            var targetTop = target.offset().top;
            var targetBottom = target.offset().top + target.height();
            if (targetTop <= top && targetBottom > top) {
                $(document).trigger($item.data('onscroll'), [$(this)]);
                return false;
            }
        });
    });
})(jQuery);
