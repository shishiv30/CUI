//tip
(function($) {
    var animationDuration = 500;
    var tipConfig = {
        name: 'tip',
        defaultOpt: {
            traget: null,
            height: 50,
            width: 320,
            type: 'normal',
            placement: 'top',
            trigger: 'click',
            html: true,
            showbefore: null,
            showafter: null,
            hidebefore: null,
            hideafter: null
        },
        init: function(context) {
            var opt = context.opt;
            var $this = context.$element;
            var $container = $('<div class="tooltip ' + opt.type + '" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>');
            $this.css({position: 'relative'});
            $this.after($container);
            $container.click(function(e) {
                e.stopPropagation();
            });
            context.$container = $container;
            $container.hide();
        },
        destroy: null,
        exports: {
            show: function() {
                var opt = this.opt;
                var $this = this.$element;
                var $container = this.$container;
                if (opt.showbefore) {
                    $.CUI.addEvent(opt.showbefore, this);
                }
                $container.find('.tooltip-inner').html(opt.content);
                var cWidth = $container.width();
                var cHeight = $container.height();
                var tWidth = $this.width();
                var tHeight = $this.height();
                var offset = $this.offset();
                var position = $this.position();
                var x = 0;
                var y = 0;
                var css = {};
                $container.show();
                $container.addClass('in');
                switch (opt.placement) {
                    case 'top':
                    case 'bottom':
                        $container.removeClass('{0} {0}-left {0}-right'.format(opt.placement));
                        y = cHeight ;
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
                            x = x - position.left;
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

                        if (opt.placement === 'left') {
                            x = cWidth * -1 + position.left - 5;
                        } else {
                            x = tWidth + position.left + 5;
                        }
                        y = (Math.abs(tHeight - cHeight) / 2);
                        css = {
                            top: -1 * y,
                            left: x,
                            right: ''
                        };
                        $container.css(css);
                        $container.addClass(opt.placement);
                        break;
                }
                if (opt.showafter) {
                    $.CUI.addEvent(opt.showafter, this);
                }
            },
            hide: function() {
                var opt = this.opt;
                var that = this;
                var $container = this.$container;
                if (opt.hidebefore) {
                    $.CUI.addEvent(opt.hidebefore, this);
                }
                $container.removeClass('in');
                setTimeout(function() {
                    $container.hide();
                    if (opt.hideafter) {
                        $.CUI.addEvent(opt.hideafter, that);
                    }
                }, animationDuration + 1);
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