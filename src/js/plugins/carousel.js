(function ($) {
    $.fn.carousel = function (option) {
        var $this = $(this);
        var defaultOpt = {
            lazingload: true,
            _drag: null,
            _coordinates: null,
        };
        var opt = $.extend({}, defaultOpt, option);
        var $scroller = $this.find('.carousel-list');
        var $ul = $this.find('ul');
        var $li = $ul.children('li');
        var prevLink = $('<a href="javascript:void(0)" class="prev"><i class="icon-angle-left"></i></a>');
        var nextLink = $('<a href="javascript:void(0)" class="next"><i class="icon-angle-right"></i></a>');
        var column;
        var wWidth;
        var currentIndex;
        var liWidth = 320;
        var offsetLeft;
        var orginalScrollLeft;
        var currentScrolLeft;
        var scrollEnd;
        var duration = 200;
        var subduration;
        var _difference = function (first, second) {
            return {
                x: first.x - second.x,
                y: first.y - second.y
            };
        };
        var _pointer = function (event) {
            var result = {x: null, y: null};

            event = event.originalEvent || event || window.event;

            event = event.touches && event.touches.length ?
                event.touches[0] : event.changedTouches && event.changedTouches.length ?
                event.changedTouches[0] : event;

            if (event.pageX) {
                result.x = event.pageX;
                result.y = event.pageY;
            } else {
                result.x = event.clientX;
                result.y = event.clientY;
            }

            return result;
        };
        var _coordinates = function (position) {
            var multiplier = 1,
                newPosition = position - 1,
                coordinate;

            if (position === undefined) {
                return opt._coordinates.map(function (coordinate, index) {
                    return _coordinates(index);
                });
            }

            coordinate = opt._coordinates[newPosition] || 0;

            coordinate = Math.ceil(coordinate);

            return coordinate;
        };
        var _maximum = function (relative) {
            var settings = this.settings,
                maximum = opt._coordinates.length,
                iterator,
                reciprocalItemsWidth,
                elementWidth;

            if (settings.loop) {
                maximum = this._clones.length / 2 + this._items.length - 1;
            } else if (settings.autoWidth || settings.merge) {
                iterator = this._items.length;
                reciprocalItemsWidth = this._items[--iterator].width();
                elementWidth = this.$element.width();
                while (iterator--) {
                    reciprocalItemsWidth += this._items[iterator].width() + this.settings.margin;
                    if (reciprocalItemsWidth > elementWidth) {
                        break;
                    }
                }
                maximum = iterator + 1;
            } else if (settings.center) {
                maximum = this._items.length - 1;
            } else {
                maximum = this._items.length - settings.items;
            }

            if (relative) {
                maximum -= this._clones.length / 2;
            }

            return Math.max(maximum, 0);
        };

        var _minimum = function (relative) {
            return relative ? 0 : this._clones.length / 2;
        };

        var _draggable = function () {
            var onDragStart = function (event) {
                // var stage = null;
                // if (event.which === 3) {
                //     return;
                // }
                // stage = $this.css('transform').replace(/.*\(|\)| /g, '').split(',');
                // stage = {
                //     x: stage[stage.length === 16 ? 12 : 4],
                //     y: stage[stage.length === 16 ? 13 : 5]
                // };
                //
                // opt._drag.time = new Date().getTime();
                // opt._drag.target = $(event.target);
                // opt._drag.stage.start = stage;
                // opt._drag.stage.current = stage;
                // opt._drag.pointer = _pointer(event);
                $(document).one('mousemove.carousel.draggable touchmove.carousel.draggable', function (event) {
                    // var delta = _difference(opt._drag.pointer, _pointer(event));
                    $(document).on('mousemove.carousel.draggable touchmove.carousel.draggable', onDragMove);
                    // if (Math.abs(delta.x) < Math.abs(delta.y)) {
                    //     return;
                    // }
                    // event.preventDefault();
                    $this.trigger('drag');
                });
                console.log('drag');
            };
            var onDragMove = function (event) {
                // var minimum = null,
                //     maximum = null,
                //     delta = _difference(opt._drag.pointer, _pointer(event)),
                //     stage = _difference(opt._drag.stage.start, delta);
                // event.preventDefault();
                // minimum = _coordinates(_minimum());
                // maximum = _coordinates(_maximum() + 1) - minimum;
                // stage.x = (((stage.x - minimum) % maximum + maximum) % maximum) + minimum;
                // this._drag.stage.current = stage;
                // $this.css({
                //     transform: 'translate3d(' + stage.x + 'px,0px,0px)'
                // });
                console.log('dragging');

            }
            var onDragEnd = function (event) {
                // var delta = _difference(opt._drag.pointer, _pointer(event)),
                //     stage = opt._drag.stage.current,
                //     direction = delta.x > 0 ? 'left' : 'right';
                //
                // $(document).off('.carousel.draggable');
                console.log('dragged');
                $this.trigger('dragged');
            };
            if ($.isMobile()) {
                $this.on('touchstart.carousel.draggable', onDragStart);
                $this.on('touchcancel.carousel.draggable', onDragEnd);
            } else {
                $this.on('mousedown.carousel.draggable', onDragStart);
                $this.on('dragstart.carousel.draggable selectstart.cui.draggable', function () {
                    return false;
                });
            }
        };

        var _lazingLoadImage = function () {
            var currentItem = $ul.children('li:lt(' + (column + 2) + ')');
            currentItem.find('img').each(function (index, img) {
                if ($(img).is('[data-src]')) {
                    $(img).attr('src', $(img).attr('data-src'));
                    $(img).removeAttr('data-src');
                }
            });
        };

        var _prev = function () {
            currentScrolLeft = 0;
            $scroller.stop().animate({
                scrollLeft: currentScrolLeft + 'px'
            }, duration, function () {
                var $last = $this.find('li:last');
                $ul.prepend($last);
                currentScrolLeft += liWidth;
                $scroller.scrollLeft(currentScrolLeft);
                $scroller.stop().animate({
                    scrollLeft: '-=' + offsetLeft + 'px'
                }, subduration);
                if (opt.lazingload) {
                    _lazingLoadImage();
                }
            });
        };
        var _next = function () {
            currentScrolLeft = scrollEnd;
            $scroller.stop().animate({
                scrollLeft: currentScrolLeft + 'px'
            }, duration, function () {
                var $last = $this.find('li:first');
                $ul.append($last);
                currentScrolLeft -= liWidth;
                $scroller.scrollLeft(currentScrolLeft);
                $scroller.stop().animate({
                    scrollLeft: '+=' + offsetLeft + 'px'
                }, subduration);
                if (opt.lazingload) {
                    _lazingLoadImage();
                }
            });
        };
        var _revert = function () {
            $scroller.stop().animate({
                scrollLeft: orginalScrollLeft + 'px'
            }, duration);
        };
        var _autoScroll = function () {
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
        var _getColumnCount = function () {
            var width = $this.width();
            if (width < 640) {
                return 1;
            } else if (width < 992) {
                return 2;
            } else if (width < 1200) {
                return 3;
            } else {
                return 4;
            }
        };
        var _reposition = function () {
            currentIndex = 1;
            orginalScrollLeft = liWidth - offsetLeft;
            $scroller.stop().animate({
                scrollLeft: orginalScrollLeft + 'px'
            }, 500);
        };
        var _setWidth = function () {
            $ul.css('width', (column + 2) * liWidth + 'px');
        };

        var _refresh = function () {
            column = _getColumnCount();
            wWidth = $this.width();
            scrollEnd = (column + 2) * 320 - wWidth;
            offsetLeft = (wWidth - liWidth * column) / 2;
            subduration = duration * offsetLeft / liWidth;
            _setWidth();
            _reposition();
        };

        var obj = {
            prev: _prev,
            next: _next,
            refresh: _refresh
        };
        var _inital = function () {
            $li.each(function (index, item) {
                var $item = $(item);
                if (index === 0) {
                    $item.attr('carousel-index', $li.length);
                } else {
                    $item.attr('carousel-index', index);
                }
            });
            prevLink.click(function () {
                obj.prev();
                return false;
            });
            nextLink.click(function () {
                obj.next();
                return false;
            });
            $this.append(prevLink);
            $this.append(nextLink);
            $(document).on('dom.resize', function () {
                _refresh();
            });
            _draggable();
            _refresh();
            _lazingLoadImage();
            $scroller.on('scroll', $.debounce(function () {
                _autoScroll();
            }, 100));
            $this.removeClass('loading');
            $this.data('data-carousel', obj);
        };
        setTimeout(function () {
            _inital();
        });
    };
    $(document).on('dom.load', function () {
        $('[data-carousel]').each(function (index, item) {
            var $item = $(item);
            $item.carousel($item);
            $item.removeAttr('data-carousel');
        });
    });
})(jQuery);
