(function($) {
    $.scrollTo = function($target, $scroll, offsettop, time) {
        if (offsettop && offsettop.indexOf('#') >= 0) {
            offsettop = $(offsettop).height() + $('#header').height();
        } else {
            offsettop = (offsettop !== undefined) ? offsettop : $('#header').height();
        }
        $scroll = $('body, html');
        $scroll.animate({
            scrollTop: $target.offset().top - offsettop - 10
        }, time >= 0 ? time : 200);
    };
    $.fn.scrollTo = function(option) {
        var $this = $(this);
        var defaultOption = {
            target: $this,
            onscroll: null
        };
        var opt = $.extend({}, defaultOption, option);

        if ($this.is('select')) {
            $this.change(function() {
                var $item = $('option:selected', $this);
                if (opt.onscroll) {
                    if ($.isFunction(opt.onscroll)) {
                        opt.onscroll($this);
                    } else {
                        $(document).trigger(opt.onscroll, [$this]);
                    }
                }

                $.scrollTo($($item.data('target')), opt.onscroll, opt.offsettop);
            });
        } else {
            $this.click(function() {
                if (opt.onscroll) {
                    if ($.isFunction(opt.onscroll)) {
                        opt.onscroll($this);
                    } else {
                        $(document).trigger(opt.onscroll, [$this]);
                    }
                }
                $.scrollTo(opt.target, opt.onscroll, opt.offsettop);
            });
        }
        $this.attr('role', 'ScrollTo');
    };

    $(document).on('dom.load.scrollTo', function() {
        if ($('[data-scrollspy]').length > 0) {
            $(document).on('dom.scroll.scrollSpy', function(e, t, isDown, initTop) {
                $('[data-scrollspy]').each(function() {
                    var offset = $($(this).attr('data-offsettop'));
                    var target = $($(this).data('target'));
                    var top = offset ? (initTop + offset.height()) : initTop;
                    top += 50;
                    var targetTop = target.offset().top;
                    var targetBottom = target.offset().top + target.height();
                    if (targetTop <= top && targetBottom > top) {
                        $(document).trigger($(this).data('onscroll'), [$(this)]);
                        return false;
                    }
                });

            });
        }

        $('[data-scrollTo]').each(function() {
            $(this).scrollTo({
                target: $($(this).data('target')),
                scroll: $(this).data('scroll'),
                offsettop: $(this).data('offsettop'),
                onscroll: $(this).data('onscroll'),
                scrollSpy: $(this).data('scrollspy')
            });
            $(this).removeAttr('data-scrollTo');
        });
    });
})(jQuery);
