(function($) {
    $.fn.gridtable = function(option) {
        var defaultOption = {
            columns: [{
                text: '',
                colspan: 1
            }]
        };
        var opt = $.extend({}, defaultOption, option);
        var $this = $(this);
        var inital = function() {
            var classname = 'table-' + +new Date();
            var colIndex = 0;
            for (var i = 0; i < opt.columns.length; i++) {
                var column = opt.columns[i];
                colIndex = colIndex + 1;
                $.insertCSS(['.'+classname + ' td:nth-of-type(' + colIndex + '):before'], 'content:"' + column.text + '";');
                if (column.colspan > 1) {
                    colIndex = colIndex + column.colspan-1;
                }
            }
            return classname;
        }
        $this.addClass(inital());
        $this.addClass("GridTable");
        $this.attr('role','grid table');
    };

    $(document).ready(function() {
        $("[data-gridtable]").each(function(index, item) {
            $(item).each(function(index, item) {
                var option = {
                    columns: $(item).find("thead th").map(function(index,item) {
                        return {
                            text: $(item).text(),
                            colspan: $(item).attr('colspan') * 1 || 1
                        };
                    })
                };
                $(item).gridtable(option);
            });
            $(item).removeAttr('data-gridtable');
        });
    });
})(jQuery);
