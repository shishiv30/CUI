//base on bs datetimepicker
(function($) {
    var inital = function() {
        $('[data-picker]').each(function() {
            var $this = $(this);
            var type = $this.attr('data-picker');
            var opt = {
                todayBtn: true,
                autoclose: true,
                todayHighlight: true,
                viewSelect: 4
            };
            switch (type) {
                case 'date':
                    $.extend(opt, {
                        format: 'yyyy-mm-dd',
                        startView: 2,
                        minView: 2,
                        maxView: 4
                    });
                    break;
                case 'time':
                    $.extend(opt, {
                        showMeridian: true,
                        format: 'hh:ii',
                        startView: 1,
                        minView: 0,
                        maxView: 1,
                        keyboardNavigation: false
                    });
                    break;
                default:
                    $.extend(opt, {
                        format: 'yyyy-mm-dd hh:ii',
                    });
                    break;
            }
            $this.datetimepicker(opt);
            $this.removeAttr('data-picker');
            $this.attr('role', 'Datepicker');
        });
    };

    $(document).on('focus', '[data-picker]', function() {
        inital();
    });
})(jQuery);
