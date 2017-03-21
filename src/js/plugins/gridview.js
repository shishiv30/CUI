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
            template: '<img >',
            breakpoint: [414, 992]
        };
        var $this = $(this);
        var opt = $.extend({}, defaultOpt, option);
        var _getColumnByBreakPoint = function(newBreakPoint) {
            opt.breakpoint = newBreakPoint || opt.breakpoint;
            var containerWidth = $this.width();
            if (opt.breakpoint && opt.breakpoint.length) {
                return opt.breakpoint.reduce(function(pre, next, index) {
                    if (containerWidth > next) {
                        return index + 1;
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
                    return pre.data('ratio') >= next.data('ratio') ? pre : next;
                } else {
                    return next;
                }
            }, null);
        };
        var colCount;
        var _createColumns = function(colCount) {
            var columns = [];
            var columnswidth = (100 / colCount) + '%';
            while (colCount > 0) {
                var $ul = $('<ul></ul>').css({
                    width: columnswidth
                });
                $ul.data('ratio', 0);
                columns.push($ul);
                colCount--;
            }
            return columns;
        };
        var _createItemInColumns = function(item) {
            var $tmp = $('<li>' + opt.template + '</li>');
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
            var $window = $(window);
            var top = $window.scrollTop();
            var bottom = top + $window.height();
            $this.find('li').each(function(index, item) {
                var $item = $(item);
                var base = $item.offset().top;
                if (base < bottom && (base + $item.height()) > top) {
                    var src = $item.data('src');
                    var $img = $item.find('img');
                    $item.addClass('gridview-loading');
                    $img.on('load', function() {
                        $item.addClass('gridview-loaded');
                    });
                    $img.on('error', function() {
                        $item.addClass('gridview-error');
                    });
                    $item.attr('src', src);
                }
            });
        };
        var _render = function() {
            var $html = $('<div class="gridview"></div>');
            var ulList = _createColumns(colCount);
            $.each(opt.items, function(index, item) {
                var $li = _createItemInColumns(item);
                var $ul = _getSmallestColumn(ulList);
                $ul.append($li);
                var newRatio = $ul.data('ratio') + $li.data('ratio');
                $ul.data('ratio', newRatio);
            });
            $.each(ulList, function(index, ul) {
                $html.append(ul);
            });
            $this.html($html);
            _loadImage();
            $(document).trigger('dom.load');
        };
        var _reload = function(force) {
            if (force) {
                colCount = -1;
            }
            if (opt.items && opt.items.length) {
                var newColCount = _getColumnByBreakPoint();
                if (colCount !== newColCount) {
                    colCount = newColCount;
                    _render();
                }
            }
        };
        _reload(true);
        var obj = {
            reload: _reload
        };
        $(document).on('dom.scroll', function() {
            _loadImage();
        });
        $(document).on('dom.resize', function() {
            _reload();
        });
        $this.data('gridview', obj);
    };
    $(document).on('dom.load', function() {
        $('[data-gridview]').each(function(index, item) {
            var $item = $(item);
            $item.gridview($item.data());
            $item.removeAttr('data-gridview');
            $item.attr('data-gridview-load');
            $item.attr('role', 'gridview');
        });
    });
})(jQuery);
