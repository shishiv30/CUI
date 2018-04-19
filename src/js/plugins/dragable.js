//seed code for create a plugin
//replace all of the "dragable" with the plugin name. (the plugin name should be same as the js file name);
(function ($) {
    var dragableConfig = {
        name: 'dragable',
        defaultOpt: {
            direction: 'x'
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            var $wrapper = $this.children('ul');
            var $slides = $wrapper.children('li');
            var prePos = 0;
            var currPos = 0;
            context._go = function (currPos, disableScroll) {
                if(disableScroll) {
                    $wrapper.addClass('is-dragging');
                }
                if(opt.direction === 'x') {
                    $wrapper.css({
                        transform: 'translateX(' + currPos + 'px)'
                    });
                } else {
                    $wrapper.css({
                        transform: 'translateY(' + currPos + 'px)'
                    });
                }
                if(disableScroll) {
                    $wrapper.removeClass('is-dragging');
                }
                prePos = currPos;
                setTimeout(function(){
                    $(document).trigger('dom.scroll');
                },200);
            };
            context._getScrollInfo = function () {
                if(opt.direction === 'x') {
                    return [prePos * -1, 0];
                } else {
                    return [0, prePos * -1];
                }
            };
            $this.on('drag', function () {
                $wrapper.addClass('is-dragging');
            });
            $this.on('dragging', function (e, dir, dist) {
                // Create a callback to determine whether the user has tracked enough to move onto the next slide.
                if(opt.direction === 'x') {
                    currPos = ('left' === dir[0]) ? (prePos - dist[0]) : (prePos + dist[0]);
                    $wrapper.css({
                        transform: ('translateX(' + currPos + 'px)')
                    });
                } else {
                    currPos = ('top' === dir[1]) ? (prePos - dist[1]) : (prePos + dist[1]);
                    $wrapper.css({
                        transform: ('translateY(' + currPos + 'px)')
                    });
                }
            });
            $this.on('dragged', function (e, dir, dist, time) {
                $wrapper.removeClass('is-dragging');
                var max = opt.direction === 'x' ? $wrapper.outerWidth() - $this.outerWidth() : $wrapper.outerHeight() - $this.outerHeight();
                var width = $slides.width();
                var height = $slides.height();
                var distance = opt.direction === 'x' ? dist[0] : dist[1];
                if(currPos >= 0 || max <= 0) {
                    currPos = 0;
                } else if((max + currPos) <= 0) {
                    currPos = max * -1;
                } else if(time / 100 > Math.abs(distance)) {
                    currPos = prePos;
                } else {
                    var offset;
                    if(opt.direction === 'x') {
                        offset = currPos % width;
                        currPos = Math.abs(offset) > width / 2 ? currPos - (width + offset) : currPos - offset;
                    } else {
                        offset = currPos % height;
                        currPos = Math.abs(offset) > height / 2 ? currPos - (height + offset) : currPos - offset;
                    }
                }
                context._go(currPos);
            });

        },
        exports: {
            getScrollInfo: function () {
                return this._getScrollInfo();
            },
            go: function (currPos, disableScroll) {
                return this._go(currPos, disableScroll);
            }
        },
        setOptionsBefore: null,
        setOptionsAfter: null,
        initBefore: null,
        initAfter: null,
        destroyBefore: null
    };
    $.CUI.plugin(dragableConfig);
    $(document).on('dom.load.dragable', function () {
        $('[data-dragable]').each(function (index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.removeAttr('data-dragable');
            $this.dragable(data);
            $this.attr('data-dragable-load', '');
        });
    });
})(jQuery);
