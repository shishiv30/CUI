(function ($) {
    var imgzoomConfig = {
        name: 'imgzoom',
        defaultOpt: {
            step: 0,
            max: 200,
            min: 50,
            defaultzoom: 100,
            target: '',
            zoombefore: null,
            zoomafter: null
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            var $target = null;
            if (opt.target) {
                $target = context.$target = $(opt.target);
            } else {
                $target = $this;
            }
            context._zoom = function (tmpStep) {
                var step = $.isNumeric(tmpStep) || opt.step;
                var currentzoom = $target.data('currentzoom');
                if (!currentzoom) {
                    currentzoom = Math.floor($target.find('img').width() / $target.outerWidth() * 10) * 10;
                }
                var scrollTop = $target.scrollTop();
                var scrollTopRate = scrollTop / $target.prop('scrollHeight');
                if (step > 0) {
                    currentzoom = Math.min(opt.max, (currentzoom + step));
                } else if (step < 0) {
                    currentzoom = Math.max(opt.min, (currentzoom + step));
                } else if (step == 0) {
                    currentzoom = opt.defaultzoom;
                }
                $target.data('currentzoom', currentzoom);
                $target.find('img').css({
                    'width': currentzoom + '%'
                });
                if (scrollTop) {
                    scrollTop = scrollTopRate * $target.prop('scrollHeight');
                    $target.scrollTop(scrollTop);
                }
            };
        },
        exports: {
            getZoom: function () {
                var $target = this.$target;
                return Math.floor($target.find('img').width() / $target.outerWidth() * 10) * 10;
            },
            setZoom: function (step) {
                var opt = this.opt;
                opt.zoombefore && $.CUI.trigger(opt.zoombefore, this);
                this._zoom(step);
                opt.zoomafter && $.CUI.trigger(opt.zoomafter, this);
            }
        },
        setOptionsBefore: null,
        setOptionsAfter: null,
        initBefore: null,
        initAfter: function (context) {
            var $this = context.$element;
            var exports = context.exports;
            exports.setZoom(0);
            $this.on('click.imgzoom', function () {
                exports.setZoom();
            });
        },
        destroyBefore: function (context) {
            var $this = context.$element;
            $this.off('click.imgzoom');
        }
    };
    $.CUI.plugin(imgzoomConfig);
    $(document).on('dom.load.imgzoom', function () {
        $('[data-imgzoom]').each(function () {
            var $this = $(this);
            var data = $this.data();
            $this.removeAttr('data-imgzoom');
            $this.imgzoom(data);
            $this.attr('data-imgzoom-load', '');
        });
    });
})(jQuery);
