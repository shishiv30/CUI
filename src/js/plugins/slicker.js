//seed code for create a plugin
//replace all of the "slicker" with the plugin name. (the plugin name should be same as the js file name);

(function ($) {
    var slickerConfig = {
        name: 'slicker',
        defaultOpt: {
            arrows: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        arrows: true,
                        slidesToShow: 3,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 640,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    }
                }, {
                    breakpoint: 375,
                    settings: {
                        arrows: false,
                        centerMode: false,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    }
                }
            ]
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            var $target = context.$target = $(opt.target);
            $(this).slick(opt);
        },
        exports: {
            show: function () {

            },
            hide: function () {

            }
        },
        setOptionsBefore: null,
        setOptionsAfter: null,
        initBefore: null,
        initAfter: function (context) {
            var $this = context.$element;
            var $target = context.$target;
            var opt = context.opt;
            var exports = context.exports;

        },
        destroyBefore: function (context) {
            var $this = context.$element;
        }
    };
    $.CUI.plugin(slickerConfig);
    $(document).on('dom.load.slicker', function () {
        $('[data-slicker]').each(function (index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.slicker(data);
            $this.removeAttr('data-slicker');
            $this.attr('data-slicker-load', '');
            $this.attr('role', 'slicker');
        });
    });
})(jQuery);