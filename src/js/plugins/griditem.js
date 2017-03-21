(function() {
    $.fn.griditem = function(option) {
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
            }],
            template: '<li><img ></li>',
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
        }
        var _getSmallerColumn = function() {

        };
        var _createColumns = function(colCount) {
            var columns = [];
            var columnswidth = (100 / colCount) + '100%';
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
        var getSmallestColumn = function(columns) {
            columns.reduce(function(prev) {

            }, null);
        };
        var _render = function() {
            if (opt.items && opt.items.length) {
                var $html = $('<div class="griditem"></div>');
                var colCount = _getColumnByBreakPoint();
                var ulList = _createColumns(colCount);
                var containerWidth = $this.width();

                var tmpArray = [];
                for (var i = 0; i < opt.items.length; i++) {
                    var item = item[i];
                    var ratio = item.height / item.width;
                    var $tmp = $(opt.template);
                    $tmp.data({
                        ratio: ratio,
                        src: item.src,
                        id: i
                    });
                    $tmp.css({
                        width: colWidth,

                    });
                    item.find('img').attr('src', item.src);

                }
                $this.html($html);
                $(document).trigger('dom.load');
            }

        };
        var _relayout = function() {

        };
        var _more = function() {

        };
        $(document).on('dom.scroll', _relayout);
        $(document).on('dom.resize', _render);
    };
    $(document).on('dom.load', function() {
        $('[data-griditem]').each(function(index, item) {
            $(item).griditem($(item).data());
            $(item).removeAttr('data-griditem');
        });
    });
})(jQuery);
