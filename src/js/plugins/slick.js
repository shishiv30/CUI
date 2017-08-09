//seed code for create a plugin
//replace all of the "slickslider" with the plugin name. (the plugin name should be same as the js file name);

(function ($) {
    $.fn.slickslider = function (options) {
        var defaultOpt = {
            centerMode: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 375,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    }
                }
            ]
        };
        var opt = $.extend({}, defaultOpt, options)
        $(this).slick(opt);
    }
    $(document).on('dom.load.slickslider', function () {
        $('[data-slickslider]').each(function (index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.slickslider(data);
            $this.removeAttr('data-slickslider');
            $this.attr('data-slickslider-load', '');
            $this.attr('role', 'slickslider');
        });
    });
})(jQuery);