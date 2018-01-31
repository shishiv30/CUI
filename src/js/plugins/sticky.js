(function ($) {
    var stickyConfig = {
        name: 'sticky',
        defaultOpt: {
            breakpoint: 'xs sm md lg',
            top: 0
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            $this.addClass('sticky').addClass(opt.breakpoint);
            $this.css({
                top: (opt.top + 'px')
            });
            return $this;
        },
        exports: null,
        setOptionsBefore: null,
        setOptionsAfter: null,
        initBefore: null,
        initAfter: null,
        destroyBefore: null
    };
    $.CUI.plugin(stickyConfig);
    $(document).on('dom.load.sticky', function () {
        $('[data-sticky]').each(function (index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.removeAttr('data-sticky');
            $this.sticky(data);
            $this.attr('data-sticky-load', '');
            $this.attr('role', 'sticky');
        });
    });
})(jQuery);