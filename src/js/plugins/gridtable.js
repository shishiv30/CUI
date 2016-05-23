(function ($) {
    $.fn.gridtable = function (option) {
        var defaultOption = {
            limitwidth: 150,
            key: 'thead th',
            limitheight: 28
        };
        var opt = $.extend({}, defaultOption, option);
        var $this = $(this);
        var $key = $this.find(opt.key);
        var $list = $this.find('tbody tr');
        var inital = function () {
            var classname = 'table-' + +new Date();
            var colIndex = 0;
            var fontsize = $key.css('fontSize').replace(/[a-z]/g, '');
            var keymaxwidth = 0;
            var columns = $key.map(function (index, item) {
                return {
                    text: $(item).text() || '',
                    colspan: $(item).attr('colspan') * 1 || 1
                };
            });
            for (var i = 0; i < columns.length; i++) {
                var column = columns[i];
                colIndex = colIndex + 1;
                $.insertCSS(['.' + classname + ' td:nth-of-type(' + colIndex + '):before'], 'content:"' + column.text + ':";');
                if (column.colspan > 1) {
                    colIndex = colIndex + column.colspan - 1;
                }
                var keywidth = $.getTextWidth(column.text, fontsize);
                if (keywidth > keymaxwidth) {
                    keymaxwidth = keywidth;
                }
            }
            keymaxwidth = opt.limitwidth > keymaxwidth ? keymaxwidth : opt.limitwidth;
            $.insertCSS(['.' + classname + ' tbody td'], 'padding-left:' + (keymaxwidth + 15) + 'px;');
            $.insertCSS(['.' + classname + ' tbody td:before'], 'width:' + (keymaxwidth + 5) + 'px;');
            if (opt.limitheight > 0) {
                $.insertCSS(['.' + classname + ' tbody tr.close'], 'max-height:' + opt.limitheight + 'px;');
            }
            $list.addClass('close');
            return classname;
        }
        $list.each(function (index, item) {
            $(item).click(function () {
                if (!$(this).hasClass('open')) {
                    $list.filter('.open').removeClass('open').addClass('close');
                    $(this).addClass('open').removeClass('close');
                }
            })
        })

        $this.addClass(inital());
        $this.attr('role', 'grid table');
    };

    $(document).on('dom.load', function () {
        $("[data-gridtable]").each(function (index, item) {
            $(item).gridtable({
                limitwidth: $(item).attr('data-limitwidth'),
                key: $(item).attr('data-key'),
                limitheight: $(item).attr('data-limitheight'),
            });
            $(item).removeAttr('data-gridtable');
        });
    });
})(jQuery);
