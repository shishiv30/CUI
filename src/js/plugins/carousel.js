(function($) {
    $.fn.carousel = function(option) {
        var $this = $(this);
        var defaultOpt = {
            lazingload: true,
            _drag: null,
            _coordinates: null,
            index: 0,
            width: 375
        };
        var opt = $.extend({}, defaultOpt, option);
        var $scroller = $this.find('.carousel-list');
        var $ul = $this.find('ul');
        var $li = $ul.children('li');
        var prevLink = $('<a href="javascript:void(0)" class="prev"><i class="icon-angle-left"></i></a>');
        var nextLink = $('<a href="javascript:void(0)" class="next"><i class="icon-angle-right"></i></a>');
        var column;
        var wWidth;
        var offsetLeft;
        var orginalScrollLeft;
        var currentScrolLeft;
        var scrollEnd;
        var duration = 200;
        var subduration;
        var _lazingLoadImage = function() {
            var currentItem = $ul.children('li:lt(' + (column + 2) + ')');
            currentItem.find('img').each(function(index, img) {
                if ($(img).is('[data-src]')) {
                    $(img).attr('src', $(img).attr('data-src'));
                    $(img).removeAttr('data-src');
                }
            });
        };
        var _prev = function() {
            currentScrolLeft = 0;
            $scroller.stop().animate({
                scrollLeft: currentScrolLeft + 'px'
            }, duration, function() {
                var $last = $this.find('li:last');
                $ul.prepend($last);
                currentScrolLeft += opt.width;
                $scroller.scrollLeft(currentScrolLeft);
                $scroller.stop().animate({
                    scrollLeft: '-=' + offsetLeft + 'px'
                }, subduration);
                if (opt.lazingload) {
                    _lazingLoadImage();
                }
            });
        };
        var _next = function() {
            currentScrolLeft = scrollEnd;
            $scroller.stop().animate({
                scrollLeft: currentScrolLeft + 'px'
            }, duration, function() {
                var $last = $this.find('li:first');
                $ul.append($last);
                currentScrolLeft -= opt.width;
                $scroller.scrollLeft(currentScrolLeft);
                $scroller.stop().animate({
                    scrollLeft: '+=' + offsetLeft + 'px'
                }, subduration);
                if (opt.lazingload) {
                    _lazingLoadImage();
                }
            });
        };
        var _revert = function() {
            $scroller.stop().animate({
                scrollLeft: orginalScrollLeft + 'px'
            }, duration);
        };
        var _autoScroll = function() {
            currentScrolLeft = $scroller.scrollLeft();
            var offset = orginalScrollLeft - currentScrolLeft;
            if (Math.abs(offset) > 5) {
                if (offset > 0) {
                    _prev();
                } else {
                    _next();
                }
            } else {
                _revert();
            }
        };
        var _getColumnCount = function() {
            return Math.floor(wWidth / opt.width) || 1;
        };
        var _reposition = function() {
            opt.index = 1;
            orginalScrollLeft = opt.width - offsetLeft;
            $scroller.stop().animate({
                scrollLeft: orginalScrollLeft + 'px'
            }, 500);
        };
        var _setWidth = function() {
            $ul.css('width', (column + 2) * opt.width + 'px');
        };

        var _refresh = function() {
            column = _getColumnCount();
            wWidth = $this.width();
            scrollEnd = (column + 2) * 320 - wWidth;
            offsetLeft = (wWidth - opt.width * column) / 2;
            subduration = duration * offsetLeft / opt.width;
            _setWidth();
            _reposition();
        };

        var obj = {
            prev: _prev,
            next: _next,
            refresh: _refresh
        };
        var _inital = function() {
            $li.each(function(index, item) {
                var $item = $(item);
                if (index === 0) {
                    $item.attr('carousel-index', $li.length);
                } else {
                    $item.attr('carousel-index', index);
                }
            });
            prevLink.click(function() {
                obj.prev();
                return false;
            });
            nextLink.click(function() {
                obj.next();
                return false;
            });
            $this.append(prevLink);
            $this.append(nextLink);
            $(document).on('dom.resize', function() {
                _refresh();
            });
            _refresh();
            _lazingLoadImage();
            $scroller.on('scroll', $.debounce(function() {
                _autoScroll();
            }, 100));
            $this.removeClass('loading');
            $this.data('data-carousel', obj);
        };
        setTimeout(function() {
            _inital();
        });
    };
    $(document).on('dom.load', function() {
        $('[data-carousel]').each(function(index, item) {
            var $item = $(item);
            $item.carousel($item);
            $item.removeAttr('data-carousel');
        });
    });
})(jQuery);
