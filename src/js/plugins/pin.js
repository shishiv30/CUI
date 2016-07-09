//pin
(function ($) {
    $.fn.pin = function (option) {
        var defaultOpt = {
            top: 50,
            bottom: 0,
            target: ''
        };
        var opt = $.extend({}, defaultOpt, option);

        var $this = $(this);
        var $target = $(opt.target);
        $this.css('position', 'relative');
        $target.addClass('pin');

        var offsetTop = 0;
        var offsetBottom = 0;
        var reposition = function () {
            offsetTop = $this.offset().top - opt.top;
            offsetBottom = offsetTop + $this.height() - $target.height() - opt.bottom;
        };
        var pin = function () {
            $target.css({
                position: 'fixed',
                'top': opt.top,
                bottom: 'auto'
            });
        };
        var unpin = function (isTop) {
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
        var setpin = function (scrollTop, isReposition) {
            if (isReposition) {
                reposition();
            }
            if (scrollTop < offsetTop) {
                unpin(true);
            } else {
                if (scrollTop > offsetBottom) {
                    unpin(false);
                } else {
                    pin();
                }
            }
        };
        $this.data('pin', {
            pin: pin,
            unpin: unpin,
            setpin: setpin
        });
        $target.attr('role', 'PinPanel');
        return $this.data('pin');
    };


    function initial(isReposition) {
        var scrollTop = $(window).scrollTop();

        $('[data-pin]').each(function () {
            if ($(this).data('pin') && $(this).data('pin').setpin) {
                $(this).data('pin').setpin(scrollTop, isReposition);
            } else {
                $(this).pin({
                    top: $(this).attr('data-top'),
                    bottom: $(this).attr('data-bottom'),
                    target: $(this).attr('data-target')
                }).setpin(scrollTop, true);
            }
        });
    }

    $(window).on('scroll', function () {
        initial(false);
    });
    $(window).on('dom.resize', function () {
        initial(true);
    });

})(jQuery);
