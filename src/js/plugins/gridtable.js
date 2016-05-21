(function ($) {
    $.fn.gridtable = function (option) {
        var defaultOption = {
            limitwidth: 150,
            key: 'thead th',
            limitheight: 35
        };
        var opt = $.extend({}, defaultOption, option);
        var $this = $(this);
        var $key = $this.find(opt.key);
        var $list = $this.find('body tr');
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
            keymaxwidth = opt.limitwidth > keymaxwidth? keymaxwidth: opt.limitwidth;
            $.insertCSS(['.' + classname + ' tbody td'], 'padding-left:' + (keymaxwidth+15) + 'px;');
            $.insertCSS(['.' + classname + ' tbody td:before'], 'width:' + (keymaxwidth+5) + 'px;');
            return classname;
        }
        if(!opt.limitheight){
            $.insertCSS(['.' + classname + ' tbody tr.close'], 'height:' + opt.limitheight + 'px;');

            $list.each(function(index,item){
                $(item).click(function(){
                    $(this).toggleClass('close');
                })
            })
        }
        $this.addClass(inital());
        $this.attr('role', 'grid table');
    };

    $(document).on('dom.load', function () {
        $("[data-gridtable]").each(function (index, item) {
            $(item).gridtable({
                limitwidth: $(item).attr('data-limitwidth')*1,
                key: $(item).attr('data-key'),
                limitheight:  $(item).attr('data-limitheight')*1,
            });
            $(item).removeAttr('data-gridtable');
        });
    });
})(jQuery);
