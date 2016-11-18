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
            hideAfter: null
        },
        init: function(context) {
            var opt = context.opt;
            var $this = context.$element;
            var $container = $('<div class="tooltip ' + opt.theme + '" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>');
            $this.css({position: 'relative'});
            $this.append($container);
            $container.click(function(e) {
                e.stopPropagation();
            });
            context.$container = $container;
        },
        destroy: null,
        exports: {
            show: function() {
                var opt = this.opt;
                var $this = this.$element;
                var $container = this.$container;
                if (opt.showBefore) {
                    $.CUI.addEvent(opt.showBefore, $this);
                }
                $container.find('.tooltip-inner').html(opt.content);
                var cWidth = $container.width() + 10;
                var cHeight = $container.height();
                var tWidth = $this.width();
                var tHeight = $this.height();
                var offset = $this.offset();
                var x = 0;
                var y = 0;
                var css = {};
                $container.addClass('in');
                switch (opt.placement) {
                    case 'top':
                    case 'bottom':
                        $container.removeClass('{0} {0}-left {0}-right'.format(opt.placement));
                        y = cHeight + 3;
                        x = (Math.abs(tWidth - cWidth) / 2);
                        if (x > offset.left) {
                            css = {
                                left: 0,
                                right: ''
                            };
                            $container.addClass('{0}-right'.format(opt.placement));
                        } else if ((offset.left + (tWidth + cWidth) / 2) > $(window).width()) {
                            css = {
                                left: '',
                                right: 0
                            };
                            $container.addClass('{0}-left'.format(opt.placement));
                        } else {
                            css = {
                                left: -1 * x
                            };
                            $container.addClass(opt.placement);
                        }
                        css[opt.placement] = -1 * y;
                        $container.css(css);
                        break;
                    case 'left':
                    case 'right':
                        $container.removeClass(opt.placement);
                        x = tWidth;
                        y = (Math.abs(tHeight - cHeight) / 2);
                        css = {
                            top: -1 * y
                        };
                        if (opt.placement === 'left') {
                            css['right'] = tWidth;
                            css['left'] = '';
                        } else {
                            css['left'] = tWidth;
                            css['right'] = '';
                        }
                        $container.css(css);
                        $container.addClass(opt.placement);
                        break;
                }
                if (opt.showAfter) {
                    $.CUI.addEvent(opt.showAfter, $this);
                }
            },
            hide: function() {
                var opt = this.opt;
                var $this = this.$element;
                var $container = this.$container;
                if (opt.hideBefore) {
                    $.CUI.addEvent(opt.hideBefore, $this);
                }
                $container.removeClass('in');
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
                    $this.on('click.' + exports.name, function() {
                        exports.show();
                        $(document).one('click', exports.hide);
                        return false;
                    });
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