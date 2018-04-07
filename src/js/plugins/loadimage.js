//lazy load image
(function ($) {
    $.fn.loadImg = function () {
        var $img = $(this);
        var imgsrc = $img.data('img');
        if(!imgsrc) {
            return;
        } else {
            $img.removeAttr('data-img');
            $img.data('img', null);
        }
        if($img.is('img')) {
            $img.one('load', function () {
                $img.off('error');
                $img.addClass('data-img-load-success');
                $(document).trigger('img.load.success', [$img]);
            });
            $img.one('error', function () {
                $img.off('load');
                $img.attr('src', 'data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEAAAIALAAAAAABAAEAAAICVAEAOw==');
                $img.addClass('data-img-load-error');
                $(document).trigger('img.load.error', [$img]);
            });
            $img.attr('src', imgsrc);
        } else {
            $img.css({
                backgroundImage: 'url(' + imgsrc + ')'
            });
            $img.addClass('data-img-load-success');
            $(document).trigger('img.load.success', [$img]);
        }
        $img.attr('data-img-load', '');
    };
    var loadimageConfig = {
        name: 'loadimage',
        defaultOpt: {
            buffer: 0,
            delay: 100,
            precache: true,
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            var $window = $(window);
            context._load = function () {
                var height = $window.outerHeight();
                var top = $window.scrollTop() - height * opt.buffer;
                var bottom = top + height * (1 + opt.buffer);
                var width = $window.outerWidth();
                var left = $window.scrollLeft() - width * opt.buffer;
                var right = left + width * (1 + opt.buffer);
                var precache = [];
                $this.find('[data-img]').each(function (index, item) {
                    var $img = $(item);
                    var offset = $img.offset();
                    var baseY = offset.top;
                    var baseX = offset.left;
                    if(baseY < bottom && (baseY + $img.height()) > top && baseX < right && (baseX + $img.width()) > left && !$img.is(':hidden')) {
                        $img.loadImg();
                    } else if(opt.precache && $img.attr('data-img') !== 'precache') {
                        var x = new Image();
                        x.src = $img.data('img');
                        $img.attr('data-img', 'precache');
                    }
                });
                // $.sendMessage(precache);
            };
            $this && $this[0].addEventListener('scroll', $.throttle(context._load, opt.delay), true);
        },
        exports: {
            load: function () {
                this._load();
            }
        },
        setOptionsBefore: null,
        setOptionsAfter: null,
        initBefore: null,
        initAfter: null,
        destroyBefore: null
    };
    $.CUI.plugin(loadimageConfig);
    $(document).on('dom.load.loadimage', function () {
        $('[data-loadimage]').each(function (index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.removeAttr('data-loadimage');
            $this.loadimage(data).load();
            $this.attr('data-loadimage-load', '');
        });
    });
    $.loadImage = $(document).loadimage().load;
    $(document).on('dom.load dom.resize', function () {
        $.loadImage();
    });
})(jQuery);
