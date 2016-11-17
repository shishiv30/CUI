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
                switch (opt.placement) {
                    case 'top':
                        $container.removeClass('top top-left top-right');
                        y = cHeight + 2;
                        x = (Math.abs(tWidth - cWidth) / 2);
                        if (x > offset.left) {
                            $container.css({
                                top: -1 * y,
                                left: 0,
                                right: ''
                            });
                            $container.addClass('top-right');
                        } else if ((offset.left + (tWidth + cWidth) / 2) > $(window).width()) {
                            $container.css({
                                top: -1 * y,
                                right: 0,
                                left: ''
                            });
                            $container.addClass('top-left');
                        } else {
                            $container.css({
                                top: -1 * y,
                                left: -1 * x
                            });
                            $container.addClass('top');
                        }
                        break;
                    case 'bottom':
                        $container.removeClass('bottom bottom-left bottom-right');
                        y = cHeight + 5;
                        x = (Math.abs(tWidth - cWidth) / 2);
                        if (x > offset.left) {
                            $container.css({
                                bottom: -1 * y,
                                left: 0,
                                right: ''
                            });
                            $container.addClass('bottom-right');
                        } else if ((offset.left + (tWidth + cWidth) / 2) > $(window).width()) {
                            $container.css({
                                bottom: -1 * y,
                                right: 0,
                                left: ''
                            });
                            $container.addClass('bottom-left');
                        } else {
                            $container.css({
                                bottom: -1 * y,
                                left: -1 * x
                            });
                            $container.addClass('bottom');
                        }
                        break;
                    case 'left':
                        x = tWidth;
                        y = (Math.abs(tHeight - cHeight) / 2);
                        $container.css({
                            top: -1 * y,
                            left: tWidth
                        });
                        $container.addClass('right');
                        break;
                    case 'right':
                        x = tWidth;
                        y = (Math.abs(tHeight - cHeight) / 2);
                        $container.css({
                            top: -1 * y,
                            right:  tWidth
                        });
                        $container.addClass('left');
                        break;
                }

                $container.addClass('in');

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