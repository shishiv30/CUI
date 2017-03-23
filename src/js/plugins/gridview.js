(function() {
    $.fn.gridview = function(option) {
        var defaultOpt = {
            items: [{
                src: 'dist/src/img/ex_1.jpg',
                height: 640,
                width: 400
            }, {
                src: 'dist/src/img/ex_2.jpg',
                height: 250,
                width: 400
            }, {
                src: 'dist/src/img/ex_3.jpg',
                height: 250,
                width: 400
            }, {
                src: 'dist/src/img/ex_4.jpg',
                height: 640,
                width: 400
            }, {
                src: 'dist/src/img/ex_5.jpg',
                height: 250,
                width: 400
            }, {
                src: 'dist/src/img/ex_6.jpg',
                height: 250,
                width: 400
            }, {
                src: 'dist/src/img/ex_7.jpg',
                height: 640,
                width: 400
            }, {
                src: 'dist/src/img/ex_8.jpg',
                height: 250,
                width: 400
            }, {
                src: 'dist/src/img/ex_9.jpg',
                height: 250,
                width: 400
            }, {
                src: 'dist/src/img/ex_1.jpg',
                height: 640,
                width: 400
            }, {
                src: 'dist/src/img/ex_2.jpg',
                height: 250,
                width: 400
            }, {
                src: 'dist/src/img/ex_3.jpg',
                height: 250,
                width: 400
            }, {
                src: 'dist/src/img/ex_4.jpg',
                height: 640,
                width: 400
            }, {
                src: 'dist/src/img/ex_5.jpg',
                height: 250,
                width: 400
            }, {
                src: 'dist/src/img/ex_6.jpg',
                height: 250,
                width: 400
            }, {
                src: 'dist/src/img/ex_7.jpg',
                height: 640,
                width: 400
            }, {
                src: 'dist/src/img/ex_8.jpg',
                height: 250,
                width: 400
            }, {
                src: 'dist/src/img/ex_9.jpg',
                height: 250,
                width: 400
            }, {
                src: 'dist/src/img/ex_1.jpg',
                height: 640,
                width: 400
            }, {
                src: 'dist/src/img/ex_2.jpg',
                height: 250,
                width: 400
            }, {
                src: 'dist/src/img/ex_3.jpg',
                height: 250,
                width: 400
            }, {
                src: 'dist/src/img/ex_4.jpg',
                height: 640,
                width: 400
            }, {
                src: 'dist/src/img/ex_5.jpg',
                height: 250,
                width: 400
            }, {
                src: 'dist/src/img/ex_6.jpg',
                height: 250,
                width: 400
            }, {
                src: 'dist/src/img/ex_7.jpg',
                height: 640,
                width: 400
            }, {
                src: 'dist/src/img/ex_8.jpg',
                height: 250,
                width: 400
            }, {
                src: 'dist/src/img/ex_9.jpg',
                height: 250,
                width: 400
            }],
            target: null,
            container: null,
            template: '<img >',
            breakpoint: [414, 640, 992, 1200],
            colCount: -1
        };
        var opt = $.extend({}, defaultOpt, option);
        var $this = opt.target ? $(opt.target) : $(this);
        var $container = opt.container ? $(opt.container) : $(window);
        var _getpositionInfo = function() {
            return {
                scrollTop: $container.scrollTop(),
                scrollBottom: $container.scrollTop() + $container.height(),
                offsetTop: $this.offset().top,
                offsetBottom: $this.offset().top + $this.height()
            };
        };
        var positionInfo = _getpositionInfo();
        var _getColumnByBreakPoint = function(newBreakPoint) {
            opt.breakpoint = newBreakPoint || opt.breakpoint;
            var containerWidth = $this.width();
            if (opt.breakpoint && opt.breakpoint.length) {
                return opt.breakpoint.reduce(function(pre, next, index) {
                    if (containerWidth > next) {
                        return pre + 1;
                    } else {
                        return pre;
                    }
                }, 1);
            }
            return 1;
        };
        var _getSmallestColumn = function(array) {
            return array.reduce(function(pre, next) {
                if (pre) {
                    return pre.data('ratio') <= next.data('ratio') ? pre : next;
                } else {
                    return next;
                }
            }, null);
        };
        var _createColumns = function(count) {
            var columns = [];
            var columnswidth = (100 / count) + '%';
            while (count > 0) {
                var $ul = $('<ul class="gridview-ul"></ul>').css({
                    width: columnswidth
                });
                $ul.data('ratio', 0);
                columns.push($ul);
                count--;
            }
            return columns;
        };
        var _createItemInColumns = function(item) {
            var $tmp = $('<li class="gridview-li">' + opt.template + '</li>');
            var ratio = item.height / item.width;
            $tmp.data({
                ratio: ratio,
                src: item.src
            });
            $tmp.css({
                paddingTop: (ratio * 100) + '%',
            });
            return $tmp;
        };
        var _loadImage = function() {
            $this.find('li').each(function(index, item) {
                var $item = $(item);
                var offsetTop = $item.offset().top;
                var offsetBottom = offsetTop + $item.outerHeight();
                if (offsetTop < positionInfo.scrollBottom && offsetBottom > positionInfo.scrollTop) {
                    var src = $item.data('src');
                    var $img = $item.find('img');
                    $item.addClass('gridview-loading');
                    $img.on('load', function() {
                        $item.removeClass('gridview-loading');
                        $item.addClass('gridview-loaded');
                    });
                    $img.on('error', function() {
                        $item.removeClass('gridview-loading');
                        $item.addClass('gridview-error');
                    });
                    $img.attr('src', src);
                }
            });
        };
        var _moveByScroll = function(isScrollDown) {
            var verticalBottom = $this.hasClass('verticalBottom');
            var heightList = $this.find('> ul').map(function(index, item) {
                return $(item).outerHeight();
            });
            var needMove = false;
            var minHeight = $this.height() - Math.min.apply(this, heightList);
            if (isScrollDown) {
                minHeight = !verticalBottom ? minHeight : 0;
                if (positionInfo.scrollTop > (positionInfo.offsetTop + minHeight) && positionInfo.scrollBottom < positionInfo.offsetBottom) {
                    needMove = true;
                }
            } else {
                minHeight = verticalBottom ? minHeight : 0;
                if (positionInfo.scrollTop > positionInfo.offsetTop && positionInfo.scrollBottom < (positionInfo.offsetBottom - minHeight)) {
                    needMove = true;
                }
            }
            if (needMove) {
                if (isScrollDown) {
                    $this.removeClass('scrollUP');
                    var containerHeight = $this.height();
                    $this.find('.gridview-ul').each(function(index, item) {
                        var $item = $(item);
                        var offsetY = containerHeight - $item.height();
                        $item.css('transform', ('translateY(' + offsetY + 'px)'));
                    });
                    $this.addClass('verticalBottom');
                } else {
                    $this.addClass('scrollUP');
                    $this.find('.gridview-ul').each(function(index, item) {
                        var $item = $(item);
                        $item.css('transform', ('translateY(' + 0 + ')'));
                    });
                    $this.removeClass('verticalBottom');
                }
            }

        };

        var _render = function() {
            var ulList = _createColumns(opt.colCount);
            $.each(opt.items, function(index, item) {
                var $li = _createItemInColumns(item);
                var $ul = _getSmallestColumn(ulList);
                $ul.append($li);
                var newRatio = $ul.data('ratio') + $li.data('ratio');
                $ul.data('ratio', newRatio);
            });
            $this.addClass('gridview');
            $this.empty();
            $.each(ulList, function(index, ul) {
                $this.append(ul);
            });
            _loadImage();
            $(document).trigger('dom.load');
        };
        var _reload = function(force) {
            if (force) {
                opt.colCount = -1;
            }
            if (opt.items && opt.items.length) {
                var newColCount = _getColumnByBreakPoint();
                if (opt.colCount !== newColCount) {
                    opt.colCount = newColCount;
                    _render();
                }
            }
        };
        _reload(true);
        var obj = {
            reload: _reload
        };
        $container.on('scroll', $.throttle(function() {
            var currentPositionInfo = _getpositionInfo();
            var isDown = positionInfo.scrollTop < currentPositionInfo.scrollTop;
            positionInfo = currentPositionInfo;
            _moveByScroll(isDown);
            _loadImage();
        }));
        $(document).on('dom.resize', function() {
            positionInfo = _getpositionInfo();
            _reload();
        });
        $this.data('gridview', obj);
    };
    $(document).on('dom.load', function() {
        $('[data-gridview]').each(function(index, item) {
            var $item = $(item);
            $item.removeAttr('data-gridview');
            $item.gridview($item.data());
            $item.attr('data-gridview-load');
            $item.attr('role', 'gridview');
        });
    });
})(jQuery);
