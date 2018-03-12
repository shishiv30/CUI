//tip
(function ($) {
    var animationDuration = 500;

    var tipConfig = {
        name: 'tip',
        defaultOpt: {
            height: 50,
            width: 320,
            type: '',
            placement: 'top',
            trigger: 'click',
            html: true,
            once: false,
            onload: null,
            showbefore: null,
            showafter: null,
            hidebefore: null,
            hideafter: null,
            _timer: null
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            var $container = $('<div class="tooltip ' + opt.type + ' ' + opt.placement + '"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>');
            $this.parent().css({
                position: 'relative'
            });
            $this.after($container);
            $container.click(function (e) {
                e.stopPropagation();
            });
            context.$container = $container;
            $container.hide();
        },
        destroy: null,
        exports: {
            show: function () {
                var opt = this.opt;
                var $this = this.$element;
                var $container = this.$container;
                clearTimeout(opt._timer);
                opt.showbefore && $.CUI.trigger(opt.showbefore, this);
                $container.find('.tooltip-inner').html(opt.content);
                var cWidth = $container.outerWidth();
                var cHeight = $container.outerHeight();
                var tWidth = $this.outerWidth();
                var tHeight = $this.outerHeight();
                var offset = $this.offset();
                var position = $this.position();
                var pWidth = $this.parent().outerWidth(true);
                var x = 0;
                var y = 0;
                var css = {};
                $container.show();
                setTimeout(function () {
                    $container.addClass('in');
                }, 10);
                switch(opt.placement) {
                case 'top':
                case 'bottom':
                    $container.removeClass('{0}-left {0}-right'.format(opt.placement));
                    x = (Math.abs(tWidth - cWidth) / 2);
                    if(x > offset.left) {
                        css = {
                            left: position.left,
                            right: ''
                        };
                        $container.addClass('{0}-right'.format(opt.placement));
                    } else if((offset.left + (tWidth + cWidth) / 2) > $(window).width()) {
                        css = {
                            left: '',
                            right: pWidth - tWidth - position.left
                        };
                        $container.addClass('{0}-left'.format(opt.placement));
                    } else {
                        x = x - position.left;
                        css = {
                            left: -1 * x
                        };
                        $container.addClass(opt.placement);
                    }
                    $container.css(css);
                    break;
                case 'left':
                case 'right':
                    $container.removeClass(opt.placement);
                    if(opt.placement === 'left') {
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
                if(opt.showafter) {
                    opt.showafter && $.CUI.trigger(opt.showafter, this);
                }
            },
            hide: function () {
                var opt = this.opt;
                var that = this;
                var $container = this.$container;
                var exports = this.exports;
                opt.hidebefore && $.CUI.trigger(opt.hidebefore, this);
                $container.removeClass('in');
                opt._timer = setTimeout(function () {
                    $container.hide();
                    opt.hideafter && $.CUI.trigger(opt.hideafter, that);
                    if(opt.once) {
                        exports.destroy();
                    }
                }, animationDuration + 1);
            }
        },
        setOptionsBefore: null,
        setOptionsAfter: function (context) {
            var opt = context.opt;
            var $container = context.$container;
            $container.find('.tooltip-inner').html(opt.content);
        },
        initBefore: null,
        initAfter: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            var exports = context.exports;
            switch(opt.trigger) {
            case 'click':
                $this.on('click.' + exports.name, function () {
                    exports.show();
                    $(document).one('click', exports.hide);
                    return false;
                });
                break;
            case 'focus':
                $this.on('focusin.' + exports.name, exports.show);
                $this.on('focusout.' + exports.name, exports.hide);
                break;
            }
            opt.onload &&  $.CUI.trigger(opt.onload, this);
        },
        destroyBefore: function (context) {
            var exports = context.exports;
            var $this = $(this);
            $this.off('click.' + exports.name);
            $this.off('focusin.' + exports.name);
            $this.off('focusout.' + exports.name);
            context.$container.remove();
        },
    };
    $.CUI.plugin(tipConfig);
    $(document).on('dom.load.tip', function () {
        $('[data-tip]').each(function () {
            var $this = $(this);
            var options = $this.data();
            $this.removeAttr('data-tip');
            $this.tip(options);
        });
    });
})(jQuery);
