//seed code for create a plugin
//replace all of the "slicker" with the plugin name. (the plugin name should be same as the js file name);

(function($) {
    var slickerConfig = {
        name: 'slicker',
        defaultOpt: {
            arrows: true,
            centerMode: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoscroll: 0,
            width: 375,
            padding: 50
        },
        init: function(context) {
            var opt = context.opt;
            var $this = context._slick = context.$element.children('ul');
            if (opt.autoscroll) {
                opt.autoplay = true;
                opt.autoplaySpeed = opt.autoscroll;
            }
            opt.responsive = [
                {
                    breakpoint: opt.width * 3 + opt.padding * 2,
                    settings: {
                        arrows: true,
                        centerMode: false,
                        slidesToShow: 3,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: opt.width * 3 - opt.padding * 2,
                    settings: {
                        arrows: true,
                        centerMode: true,
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: opt.width * 2 + opt.padding * 2,
                    settings: {
                        arrows: true,
                        centerMode: false,
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: opt.width * 2 - opt.padding * 2,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    }
                }, {
                    breakpoint: opt.width + opt.padding * 2,
                    settings: {
                        arrows: false,
                        centerMode: false,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    }
                }
            ];
            opt.centerPadding = opt.padding + 'px';
            delete opt.padding;
            delete opt.width;
            delete opt.autoscroll;
            $this.slick(opt);
        },
        exports: {
            next: function() {
                this._slick.slick('slickNext');
            },
            prev: function() {
                this._slick.slick('slickPrev');
            },
            go: function(index, noAnimate) {
                this._slick.slick('slickGoTo', index, noAnimate);
            },
        }
    };
    $.CUI.plugin(slickerConfig);
    $(document).on('dom.load.slicker', function() {
        $('[data-slicker]').each(function(index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.slicker(data);
            $this.removeAttr('data-slicker');
            $this.attr('data-slicker-load', '');
            $this.attr('role', 'slicker');
        });
    });
})(jQuery);