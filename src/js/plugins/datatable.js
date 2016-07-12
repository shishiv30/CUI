(function($) {
    var dataType = ['string', 'number', 'date'];
    $.fn.datatable = function() {
        var defaultOption = {
            data: {
                columns: [{
                    key: 'name',
                    type: 'string'
                    display: 'Name'
                }, {
                    key: 'age',
                    type: 'number'
                    display: 'Age'
                }, {
                    key: 'birthday',
                    type: 'date'
                    display: 'Birthday'
                }],
                data: [{
                    name: 'Conjee',
                    age: '30',
                    birthday: '09/05/1986'
                }]
            }
        };
        var opt = $.extend({}, defaultOption, option);
        var $table = $('<table class="datatable"></table>');
        var $header = $('<thead><tr></tr></thead>');
        var _refreshThead = function() {
            if (option.columns && option.columns.length) {
                for (var j = 0; j < option.columns.length; j++) {
                    var column = option.columns[j];
                    var type = column.type;
                    if (refreshHeader) {
                        $header.empty();
                        var display = column.display || column.name;
                        $header.append('<th>' + display + '</th>')
                    }
                }
            }
        }
        var _refresh = function(refreshHeader) {
            if (option.data && option.data.length) {
                for (var i = 0; i < option.data.length; i++) {
                    var rowData = option.data[i];
                    for (var j = 0; j < option.columns.length; j++) {
                        var column = option.columns[j];
                        var value = rowData[column.key];
                        if (refreshHeader) {
                            $header.empty();
                            var display = column.display || column.name;
                            $header.append('<th>' + display + '</th>')
                        }
                    }
                }
            } else {
                return null;
            }
        }



    }
})(jQuery);