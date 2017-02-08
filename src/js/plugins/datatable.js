(function($) {
    var dataTableConfig = {
        $element: null,
        name: 'datatable',
        defaultOpt: {
            columns: [],
            data: null,
            maxcount: -1,
            nodatatemplate: null,
            hideText: 'See More'
        },
        initBefore: null,
        init: function(context) {
            var opt = context.opt;
            var $this = context.$element;
            var $thead = $('<thead></thead>');
            var $colgroup = $('<colgroup></colgroup>');
            var $tbody = $('<tbody></tbody>');
            var $tfoot = $('<tfoot></tfoot>');
            var $table;
            var _getRawValue = function(value, column) {
                switch (column.type) {
                    case 'date':
                        return +new Date(value) || 0;
                    case 'number':
                        if (value.replace) {
                            value = value.replace(/[^0-9.]/g, '');
                        }
                        return value * 1 || 0;
                    default:
                        return value;
                }
            };
            var _getDisplayText = function(value, column) {
                switch (column.type) {
                    case 'number':
                        if ($.isNumeric(value)) {
                            return column.format ? value.toFixed(column.format * 1) : value;
                        } else {
                            return '';
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
            var _getRenderHtml = function(template, data) {
                return Mustache.render(template, data);
            };
            var _sort = function(column, isDesc) {
                if (opt.data && opt.data.length) {
                    if (isDesc) {
                        opt.data = opt.data.sort(function(a, b) {
                            return _getRawValue(a[column.key], column) > _getRawValue(b[column.key], column) ? 1 : -1;
                        });
                    } else {
                        opt.data = opt.data.sort(function(a, b) {
                            return _getRawValue(a[column.key], column) < _getRawValue(b[column.key], column) ? 1 : -1;
                        });
                    }
                }
                _initalTbody();
                if (!$tfoot.find('td').is(':hidden')) {
                    _initalTfoot();
                }

            };
            var _initalThead = function() {
                $thead.empty();
                $colgroup.empty();
                if (opt.columns && opt.columns.length) {
                    var $tr = $('<tr></tr>');
                    for (var j = 0; j < opt.columns.length; j++) {
                        var column = opt.columns[j];
                        var display = column.display !== undefined ? column.display : column.key;

                        var $td = $('<th></th>');
                        if (column.sortable) {
                            var $link = $('<a href="javascript:void(0)" class="datatable-sort">' + display + '</a>');
                            $link.data('column', column);
                            $link.on('click', function() {
                                var $this = $(this);
                                var isDesc = $this.hasClass('desc');
                                _sort($this.data('column'), isDesc);
                                $thead.find('.active').removeClass('active');
                                $this.toggleClass('desc').addClass('active');

                            });
                            $td.append($link);
                        } else {
                            $td.html(display);
                        }
                        if (column.width) {
                            $colgroup.append('<col width="' + column.width + '"/>');
                        } else {
                            $colgroup.append('<col/>');
                        }
                        $tr.append($td);
                    }
                    $thead.append($tr);
                }
                return [$colgroup, $thead];
            };
            var _initalTbody = function() {
                $tbody.empty();
                if (opt.data && opt.data.length) {
                    for (var i = 0; i < opt.data.length; i++) {
                        var rowData = opt.data[i];
                        var $tr = $('<tr></tr>');
                        for (var j = 0; j < opt.columns.length; j++) {
                            var column = opt.columns[j];
                            var value = rowData[column.key];
                            if (!column.template) {
                                value = _getDisplayText(value, column);
                            } else {
                                value = _getRenderHtml(column.template, rowData);
                            }
                            $tr.append('<td>' + value + '</td>');
                        }
                        $tbody.append($tr);
                    }
                } else {
                    if (opt.nodatatemplate) {
                        var tmpRow = $('<tr class="no-result"><td colspan="' + opt.columns.length + '">' + opt.nodatatemplate + '</td></tr>');
                        $tbody.append(tmpRow);
                    }
                }
                return $tbody;
            };
            var _initalTfoot = function() {
                $tfoot.empty();
                if (opt.maxcount > 0 && opt.data.length > opt.maxcount) {
                    var $tr = $('<tr></tr>');
                    var $link = $('<td colspan="' + opt.columns.length + '"><a href="javascript:;" class="btn blue" >' + opt.hideText + '</a></td>');
                    $tbody.find('tr').eq(opt.maxcount - 1).nextAll().hide();
                    $link.click(function() {
                        $tbody.find('tr').eq(opt.maxcount - 1).nextAll().show();
                        $(this).hide();
                    });
                    $tr.append($link);
                    $tfoot.append($tr);
                }
                return $tfoot;
            };
            var _initTable = context._initTable = function() {
                //todo send context to the follow method, otherwise the context.opt will not update
                if (opt.data && opt.data.length) {
                    $table = $('<table class="datatable"></table>');
                    $table.append(_initalThead());
                    $table.append(_initalTbody());
                    $this.empty().append($table);
                    $table.append(_initalTfoot());
                }
            };
            _initTable();
        },
        exports: {},
        setOptionsBefore: null,
        setOptionsAfter: function(context) {
            context._initTable();
        },
        destroyBefore: function(context) {
            var $this = context.$element;
            $this.remove();
        },
        initAfter: null
    };
    $.CUI.plugin(dataTableConfig);
    $(document).on('dom.load.datatable', function() {
        $('[data-datatable]').each(function() {
            var $this = $(this);
            var data = $this.data();
            $this.datatable(data);
            $this.removeAttr('data-datatable');
            $this.attr('data-datatable-load', '');
            $this.attr('role', 'Datatable');
        });
    });
})(jQuery);
