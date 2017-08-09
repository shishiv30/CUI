//lazy load image

(function ($) {
    var loadimageConfig = {
        name: 'loadimage',
        defaultOpt: {
            buffer: 0,
            container: null
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            var $container = context.$container = opt.container ? $(opt.container) : $(window);
            var height = $container.height();
            var top = $this.scrollTop() - height * opt.buffer;
            var bottom = top + height * (1 + opt.buffer);
            context._load = function () {
                var height = $container.outerHeight();
                var top = $container.scrollTop() - height * opt.buffer;
                var bottom = top + height * (1 + opt.buffer);
                $this.find('[data-img]').each(function (index, item) {
                    var $img = $(item);
                    var base = $img.offset().top;
                    if (base < bottom && (base + $img.height()) > top) {
                        var imgsrc = $img.data('img');
                        if ($img.is('img')) {
                            $img.one('load', function () {
                                $img.addClass('data-img-load-success');
                                $(document).trigger('img.load.success', [$img]);
                            });
                            $img.one('error', function () {
                                $img.attr('src', 'data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEAAAIALAAAAAABAAEAAAICVAEAOw==');
                                $img.addClass('data-img-load-error');
                                $(document).trigger('img.load.error', [$img]);
                            });
                            imgsrc && $img.attr('src', imgsrc);
                            $img.removeAttr('data-img');
                            $img.attr('data-img-load', '');
                            $img.addClass('img-loading');
                        }
                    }
                });
            };
            $container.on('scroll', $.debounce(context._load, 100));
            $container.on('dom.scroll', context._load);
            $(document).on('dom.load', context._load);
        },
        exports: {
            load: function () {
                this._load();
            }
        },
        setOptionsBefore: null,
        setOptionsAfter: null,
        initBefore: null,
        initAfter: function (context) {
            var $this = context.$element;
            var $container = context.$container;
            var opt = context.opt;
            var exports = context.exports;
        },
        destroyBefore: function (context) {
            var $this = context.$element;
        }
    };
    $.CUI.plugin(loadimageConfig);
    $(document).on('dom.load.loadimage', function () {
        $('[data-loadimage]').each(function (index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.loadimage(data).load();
            $this.removeAttr('data-loadimage');
            $this.attr('data-loadimage-load', '');
            $this.attr('role', 'loadimage');
        });
    });
})(jQuery);