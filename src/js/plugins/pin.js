//seed code for create a plugin
//replace all of the "pin" with the plugin name. (the plugin name should be same as the js file name);

(function ($) {
    var pinConfig = {
        name: 'pin',
        defaultOpt: {
            top: 50,
            bottom: 0,
            target: ''
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            var $target = context.$target = $(opt.target);
            $this.css('position', 'relative');
            $target.addClass('pin');
            var offsetTop = 0;
            var offsetBottom = 0;
            var reposition = function () {
                offsetTop = $this.offset().top - opt.top;
                offsetBottom = offsetTop + $this.height() - $target.height() - opt.bottom;
            };
            var _pin = function () {
                $target.css({
                    position: 'fixed',
                    'top': opt.top,
                    bottom: 'auto'
                });
            };
            var _unpin = function (isTop) {
                if (isTop) {
                    $target.css({
                        position: 'absolute',
                        top: 0,
                        bottom: 'auto'
                    });
                } else {
                    $target.css({
                        position: 'absolute',
                        top: 'auto',
                        bottom: 0
                    });
                }
            };
            var _setpin = function (scrollTop, isReposition) {
                if (isReposition) {
                    reposition();
                }
                if (scrollTop < offsetTop) {
                    _unpin(true);
                } else {
                    if (scrollTop > offsetBottom) {
                        _unpin(false);
                    } else {
                        _pin();
                    }
                }
            };
            context = $.extend(context, {
                _pin: _pin,
                _unpin: _unpin,
                _setpin: _setpin
            });
            window.addEventListener('scroll', function () {
                var scrollTop = $(window).scrollTop();
                _setpin(scrollTop, false);
            }, true);
            $(document).on('dom.resize', function () {
                _setpin($.CUI.scrollTop, true);
            });
        },
        exports: {
            pin: function () {
                this._pin();
            },
            unpin: function () {
                this._unpin();
            },
            setpin: function () {
                this._setpin();
            },
        },
        setOptionsBefore: null,
        setOptionsAfter: null,
        initBefore: null,
        initAfter: null,
        destroyBefore: null
    };
    $.CUI.plugin(pinConfig);
    $(document).on('dom.load.pin', function () {
        $('[data-pin]').each(function (index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.removeAttr('data-pin');
            $this.pin(data);
            $this.attr('data-pin-load', '');
        });
    });
})(jQuery);
