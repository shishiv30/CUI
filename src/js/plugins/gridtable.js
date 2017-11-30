(function($) {
    var gridtableConfig = {
        name: 'gridtable',
        defaultOpt: {
            key: 'thead th',
        },
        initBefore: function() {

        },
        init: function(context) {
            var opt = context.opt;
            var $this = context.$element;
            var $key = $this.find(opt.key);
            var $list = $this.find('tbody tr');
            var inital = function() {
                var classname = 'table-' + +new Date();
                var colIndex = 0;
                var fontsize = $key.css('fontSize').replace(/[a-z]/g, '');
                var keymaxwidth = 0;
                var columns = $key.map(function(index, item) {
                    return {
                        text: $(item).text() || '',
                        colspan: $(item).attr('colspan') * 1 || 1
                    };
                });
                for (var i = 0; i < columns.length; i++) {
                    var column = columns[i];
                    colIndex = colIndex + 1;
                    $list.each(function() {
                        $(this).find('td').eq(i).attr('data-th', column.text);
                    });
                    if (column.colspan > 1) {
                        colIndex = colIndex + column.colspan - 1;
                    }
                    var keywidth = $.getTextWidth(column.text, fontsize);
                    if (keywidth > keymaxwidth) {
                        keymaxwidth = keywidth;
                    }
                }
                $list.addClass('close');
                return classname;
            };
            $list.each(function(index, item) {
                $(item).click(function() {
                    if (!$(this).hasClass('open')) {
                        $list.filter('.open').removeClass('open').addClass('close');
                        $(this).addClass('open').removeClass('close');
                    }
                });
            });

            $this.addClass(inital());
            $this.attr('role', 'grid table');
        },
        exports: {},
        setOptionsBefore: null,
        setOptionsAfter: null,
        destroyBefore: null,
        initAfter: null,
        isThirdPart: false,
    };
    $.CUI.plugin(gridtableConfig);
    $(document).on('dom.load', function() {
        $('[data-gridtable]').each(function(index, item) {
            var data = $(item).data();
            $(item).gridtable(data);
            $(item).removeAttr('data-gridtable');
            $(item).attr('data-gridtable-load', '');
            $(item).attr('role', 'Gridtable');
        });
    });
})(jQuery);
