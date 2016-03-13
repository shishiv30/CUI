(function($) {
    $(document).on("dom.load", function() {
        $.csv = function() {
            var namespace = {};

            namespace.getDataFromTable = function(id) {
                var trList = $("#" + id).find("tr");
                var array = [];
                for (var i = 0; i < trList.length; i++) {
                    var items = [];
                    var tdList = $(trList[i]).find("td,th");
                    for (var j = 0; j < tdList.length; j++) {
                        items.push('"' + $.trim($(tdList[j]).text()).replace(/\n/g, '').replace(/\s{2,}/g, '    ') + '"');
                    }
                    array.push(items);
                }
                return array;
            };
            namespace.get = function(array, fileName) {
                var str = "";
                for (var i = 0; i < array.length; i++) {
                    if (array[i].length > 0) {
                        str += array[i].join(",").replace(/—/g, '-') + "\n";
                    }
                }
                return str;
            };
            return namespace;
        }();
        $.ics = function() {
            var namespace = {};
            if (!$("#sendICSForm").length) {
                var form = $('<form method="post" action="' + context.appUrl + 'getics" name="sendICSForm"  id="sendICSForm"></form>');
                form.append($('<input type="hidden" name="icsContent" id="icsStr">'));
                form.append($('<input type="hidden" name="icsFileName" id="icsFileName">'));
                $("body").append(form);
            }
            namespace.get = function(content, fileName) {
                if (content) {
                    $("#icsStr").val(JSON.stringify(content));
                    $('#icsFileName').val(fileName ? fileName : "");
                    $("#sendICSForm").submit();
                }
            };
            return namespace;
        }();

    });


    $.fn.csv = function(option) {
        var defaultOpt = {
            data: null,
            name: ''
        };
        var opt = $.extend({}, defaultOpt, option);
        var $this = $(this);
        var _download = function() {
            var content;
            if (typeof opt.data === 'string') {
                content = $.csv.get($.call(opt.data), opt.name);
            } else {
                content = $.csv.get(opt.data, opt.name);
            }
            var str = encodeURIComponent(content);
            var href = 'data:text/csv;charset=utf-8,' + str;
            var fileName = opt.name || 'Market_Snapshot.csv';
            var link = $('<a id="downLink" style="display: none;" href="' + href + '" download="' + fileName + '">link</a>');
            $('body').append(link);
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(new Blob([content], {
                    type: 'text/csv;charset=utf-8;'
                }), fileName);
            } else {
                link[0].click();
            }
            setTimeout(function() {
                link.remove();
            });
        };
        $this.on('click', _download);
        var namespace = {
            download: _download
        };
        $this.data("csv", namespace);
        $this.attr('role','ExportCSV');
        return namespace;
    };

    $.fn.ics = function(option) {
        var defaultOpt = {
            data: '',
            name: ''
        };
        var opt = $.extend({}, defaultOpt, option);
        var $this = $(this);

        var _download = function() {
            var content;
            if (typeof opt.data === 'string') {
                content = $.ics.get($.call(opt.data), opt.name);
            } else {
                content = $.ics.get(opt.data, opt.name);
            }
            var str = encodeURIComponent(content);
            var href = 'data:text/ics;charset=utf-8,' + str;
            var fileName = opt.name || 'Market_Snapshot.ics';
            var link = $('<a id="downLink" style="display: none;" href="' + href + '" download="' + fileName + '">link</a>');
            $('body').append(link);
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(new Blob([content], {
                    type: 'text/ics;charset=utf-8;'
                }), fileName);
            } else {
                link[0].click();
            }
            setTimeout(function() {
                link.remove();
            });
        };

        $this.on('click', _download);
        var namespace = {
            download: _download
        };
        $this.data("ics", namespace);
        $this.attr('role','ExportICS');
        return namespace;
    };

    $(document).on('click', '[data-export]', function() {
        var $this = $(this);
        var type = $this.attr('data-export');
        $this[type]({
            data: $this.attr('data-call'),
            name: $this.attr('data-name')
        }).download();
        $this.removeAttr('data-export');
    });

})(jQuery);
