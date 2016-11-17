//tip
(function($) {
    var tipConfig = {
        name: 'tip',
        defaultOpt: {
            traget: null,
            height: 50,
            width: 320,
            theme: 'normal',
            placement: 'top',
            trigger: 'click',
            html: true,
            showBefore: null,
            showAfter: null,
            hideBefore: null,
            hideAfter: null,
        },
        init: function(context) {
            var opt = context.opt;
            var $this = context.$element;
            var $container = $('<div class="tooltip ' + opt.theme + ' ' + opt.placement + '" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>');
            $container.hide();
            $this.after($container);
            context.$container = $container;
        },
        destroy: null,
        exports: {
            show: function(context) {
                var opt = context.opt;
                var $this = context.$element;
                var $container = context.$container;
                if (opt.showBefore) {
                    $.CUI.addEvent(opt.showBefore, $this);
                }
                $container.find('.tooltip-inner').html(opt.content);
                $container.show();
                if (opt.showAfter) {
                    $.CUI.addEvent(opt.showAfter, $this);
                }
            },
            hide: function(context) {
                var opt = context.opt;
                var $this = context.$element;
                var $container = context.$container;
                if (opt.hideBefore) {
                    $.CUI.addEvent(opt.hideBefore, $this);
                }
                $container.hide();
                if (opt.hideAfter) {
                    $.CUI.addEvent(opt.hideAfter, $this);
                }
            }
        },
        setOptionsBefore: null,
        setOptionsAfter: function(context) {
            var opt = context.opt;
            var $container = context.$container;
            $container.find('.tooltip-inner').html(opt.content);
        },
        initBefore: null,
        initAfter: function(context) {
            var opt = context.opt;
            var $this = context.$element;
            var exports = context.exports;
            switch (opt.trigger) {
                case 'click' :
                    $this.on('click.' + exports.name, exports.show);
                    break;
                case 'focus' :
                    $this.on('focusin.' + exports.name, exports.show);
                    $this.on('focusout.' + exports.name, exports.hide);
                    break;
                case 'hover' :
                    $this.on('mouseenter.' + exports.name, exports.show);
                    $this.on('mouseleave.' + exports.name, exports.hide);
                    break;
            }
        },
        destroyBefore: function(context) {
            var exports = context.exports;
            var $this = $(this);
            $this.off('click.' + exports.name);
            $this.off('focusin.' + exports.name);
            $this.off('focusout.' + exports.name);
            $this.off('mouseenter.' + exports.name);
            $this.off('mouseleave.' + exports.name);
            context.$container.remove();
        },
    };
    $.CUI.plugin(tipConfig);
    $(document).on('dom.load.tip', function() {
        $('[data-tip]').each(function() {
            var options = $(this).data();
            $(this).tip(options);
            $(this).removeAttr('data-tip');
            $(this).attr('role', 'Tip');
        });
    });
})(jQuery);