//lazy load image
(function($) {
    var timer;
    var callback;
    $.fn.extend({
        loadImage: function() {
            var buffer = 0.5;
            var top = $(this).scrollTop();
            var bottom = top + $(this).height() * (1 + buffer);
            top = top - $(this).height() * buffer;
            function animateImg(item) {
                $(item).animate({
                    opacity: "1"
                }, 1000, function() {
                    $(item).removeAttr("data-img");
                });
            }
            $("[data-img]").each(function(index, item) {
                var base = $(item).offset().top;
                if (base < bottom && (base + $(item).height()) > top) {
                    var imgsrc = $(item).data("img");
                    if (callback) {
                        callback(item, function() {
                            animateImg(item);
                        });
                    } else {
                        animateImg(item);
                    }
                    imgsrc && $(item).attr("src", imgsrc);
                }
            });
        }
    });

    $.fn.loadImage.setCallback = function(fn) {callback = fn;}

    function initial(e) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            $(window).loadImage();
        }, 10);
    }

    $(document).on('dom.load', function() {
        var $scroll = $("[data-img-scroll]");
        $scroll.each(function() {
            var target = $(this);
            target.on('scroll', function() {
                $(document).trigger('dom.scroll', [target]);
            });
        });
        $scroll.removeAttr("data-img-scroll");
    });

    $(document).on('dom.load dom.scroll dom.resize', function() {
        initial();
    });
})(jQuery);