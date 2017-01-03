// simplezoomer
(function($) {
    $.fn.imgzoom = function(options) {
        var defaultOpt = {
            zoomType: 'zoomin',
            zoomStep: 10,
            max: 200,
            min: 50,
            target: '',
            onZoom: null,
        };
        var opt = $.extend({}, defaultOpt, options);
        var $this = $(this);
        var $target = $(opt.target);
        var _zoom = function() {
            var currentzoom = $target.data('currentzoom');
            if (!currentzoom) {
                currentzoom = Math.floor($target.find('img').width() / $target.outerWidth() * 10) * 10;
            }
            if (opt.zoomType === 'zoomin') {
                currentzoom = Math.min(opt.max, (currentzoom + opt.zoomStep));
            } else if (opt.zoomType === 'zoomout') {
                currentzoom = Math.max(opt.min, (currentzoom - opt.zoomStep));
            }
            $target.data('currentzoom', currentzoom);
            $target.find('img').css({'width': currentzoom + '%'});
            if (opt.onZoom) {
                if ($.isFunction(opt.onZoom)) {
                    opt.onZoom(currentzoom);
                } else {
                    $(document).trigger(opt.onZoom, [currentzoom]);
                }
            }
        }
        $this.on('click', _zoom);
    };
    $(document).on('dom.load.imgzoom', function() {
        $('[data-imgzoom]').each(function() {
            var $this = $(this);
            $this.imgzoom({
                zoomType: $this.attr('data-zoomtype'),
                zoomStep: $this.attr('data-zoomstep'),
                max: $this.attr('data-max:'),
                min: $this.attr('data-min'),
                target: $this.attr('data-target'),
                onZoom: $this.attr('data-onzoom')
            });
            $this.removeAttr('data-imgzoom');
        });
    });
})(jQuery);

