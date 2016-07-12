(function ($) {
    var dataType = ['string', 'number', 'date'];
    $.fn.datatable = function (option) {
        var $this = $(this);
        var defaultOption = {
            columns: [],
            data: [],
            onbefore: null,
            onafter: null
        };
        var opt = $.extend({}, defaultOption, option);
        var $thead = $('<thead></thead>');
        var $tbody = $('<tbody></tbody>');
        var $table;
        var _getRawValue = function (value, column) {
            switch (column.type) {
                case 'date':
                    return +new Date(value) || 0;
                case 'number':
                    return Number.parseFloat(value) || 0;
                default:
                    return value;
            }
        };
        var _getDisplayText = function (value, column) {
            switch (column.type) {
                case 'number':
                    if ($.isNumeric(value)) {
                        return column.format ? Number.parseFloat(value).toFixed(column.format * 1) : Number.parseFloat(value);
                    } else {
                        return ''
                    }
                case 'string':
                    return $.htmlencode(value);
                case 'date':
                    var time = new Date(value);
                    return time.valueOf() ? time.format(column.format || 'Y-m-d') : '';
                default:
                    return value;
            }
        };
        var _getColumnByKey = function (key) {
            return opt.columns.reduce(function (pre, next) {
                if (!pre && next.key === key) {
                    return next;
                }
            }, null);
        };
        var _sort = function (column, isDesc) {
            if (opt.data && opt.data.length) {
                if (isDesc) {
                    opt.data = opt.data.sort(function (a, b) {
                        return _getRawValue(a[column.key], column) > _getRawValue(b[column.key], column);
                    });
                } else {
                    opt.data = opt.data.sort(function (a, b) {
                        return _getRawValue(a[column.key], column) < _getRawValue(b[column.key], column);
                    });
                }
            }
            _initalTable();
        };
        var _initalThead = function () {
            $thead.empty();
            if (opt.columns && opt.columns.length) {
                var $tr = $('<tr></tr>');
                for (var j = 0; j < opt.columns.length; j++) {
                    var column = opt.columns[j];
                    var type = column.type;
                    var display = column.display || column.name;
                    var $td = $('<td></td>');
                    if (column.sortable) {
                        var $link = $('<a href="javascript:;" class="datatable-sort">' + display + '</a>');
                        $link.on('click', function () {
                            var $this = $(this);
                            var isDesc = $this.hasClass('desc');
                            _sort(column, isDesc);
                            $thead.find('.active').removeClass('active');
                            $this.toggleClass('desc').addClass('active');

                        });
                        $td.append($link);
                    } else {
                        $td.html(display);
                    }

                    $tr.append($td);
                    $thead.append($tr);
                }
            }
            return $thead;
        };
        var _initalTbody = function () {
            $tbody.empty();
            if (opt.data && opt.data.length) {
                for (var i = 0; i < opt.data.length; i++) {
                    var rowData = opt.data[i];
                    var $tr = $('<tr></tr>');
                    for (var j = 0; j < opt.columns.length; j++) {
                        var column = opt.columns[j];
                        var value = rowData[column.key];
                        value = _getDisplayText(value, column);
                        $tr.append('<td>' + value + '</td>')
                    }
                    $tbody.append($tr);
                }
            }
            return $tbody;
        };
        var _initalTable = function (isInital) {
            if (isInital) {
                $table = $('<table class="datatable"></table>');
                $table.append(_initalThead());
                $table.append(_initalTbody());
                $this.empty().append($table);
            } else {
                _initalTbody();
            }
        };
        var _option = function (option) {
            opt = $.extend(opt, option);
            return opt;
        };
        var obj = {
            option: _option
        };
        if (opt.onbefore) {
            if ($.isFunction(opt.onbefore)) {
                opt.onbefore(obj);
            } else {
                $(document).trigger(opt.onbefore, [obj]);
            }
        }
        _initalTable(true);
        if (opt.onafter) {
            if ($.isFunction(opt.onafter)) {
                opt.onafter(obj);
            } else {
                $(document).trigger(opt.onafter, [obj]);
            }
        }
    }
    $(document).on('dom.load', function () {
        $('[data-datatable]').each(function () {
            var $this = $(this);
            var data = $this.data();
            $this.datatable(data);
            $this.removeAttr('data-datatable');
        });
    })
})(jQuery);