//base on bs datetimepicker
(function($) {
    var pickerContext = {
        $element: null,
        name: 'picker',
        defaultOpt: {
            picker: null
        },
        initBefore: null,
        init: function(context) {
            var $this = context.$element;
            var type = context.opt.picker;
            var opt = {
                todayBtn: true,
                autoclose: true,
                todayHighlight: true,
                viewSelect: 4,
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
        },
        exports: {
            original: function() {
                return this.$element.data('datetimepicker');
            }
        },
        isThirdPart: true,
        setOptionsBefore: null,
        setOptionsAfter: null,
        destroyBefore: null,
        initAfter: null,
    };
    $.CUI.plugin(pickerContext);
    $(document).on('focus', '[data-picker]', function() {
        var $this = $(this);
        var opt = $this.data();
        $this.removeAttr('data-picker');
        $this.picker(opt);
        $this.attr('data-picker-load', '');
        $this.attr('role', 'Datepicker');
    });
})(jQuery);
