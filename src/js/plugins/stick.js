(function($) {
    $.fn.stick = function(option) {
        var defaultOpt = {
            offset: 50
        };
        var $this = $(this);
        var shouldwrap = $this.css('position') === 'static' || $this.css('position') === 'relative';
        var height = $this.outerHeight();
        if (shouldwrap) {
            var $warp = $('<div></div>').height(height);
            $this.wrap($warp);
        }
        var opt = $.extend(option, defaultOpt);
        var top = $this.offset().top;
        var _stick = function() {
            if ($(document).scrollTop() > (top - opt.offset)) {
                $this.addClass('stick');
                $this.css('top', opt.offset);
            } else {
                $this.removeClass('stick');
            }
        };

        $(window).on('scroll', _stick);
        _stick();
        $this.attr('role', 'Stick');
    };
    $(document).on('dom.load', function() {
        $('[data-stick]').each(function(index, item) {
            $(item).removeAttr('data-stick');
            $(item).stick({
                offset: $(item).attr('data-offset') * 1 || 50
            });
        });
    });
})(jQuery);
