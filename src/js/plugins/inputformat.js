(function ($) {
    var inputformatConfig = {
        name: 'inputformat',
        defaultOpt: {
            type: 'phone',
        },
        initBefore: null,
        init: function (context) {
            var $this = context.$element;
            var opt = context.opt;
            var timer = null;
            var _get = function () {
                var value = $this.val();
                switch (opt.type) {
                    case 'phone':
                        return value.replace(/[^0-9]/g, '');
                    case 'price':
                        return value.replace(/[^0-9.]/g, '');
                    default:
                        return value;
                }
            };
            var _set = function () {
                var value = _get();
                var formatString = '';
                switch (opt.type) {
                    case 'phone':
                        if (value.length >= 4) {
                            formatString += value.slice(0, 3) + '-';
                            if (value.length >= 7) {
                                formatString += value.slice(3, 6) + '-';
                                formatString += value.slice(6, Math.min(value.length, 11));
                            } else {
                                formatString += value.slice(3, value.length);
                            }
                        } else {
                            formatString += value;
                        }
                        break;
                    case 'price':
                        var arrPrice = value.toString().split('.');
                        formatString = arrPrice[0];
                        var pricePattern = /(\d+)(\d{3})/;
                        while (pricePattern.test(formatString))
                            formatString = formatString.replace(pricePattern, '$1,$2');
                        if (arrPrice.length >= 2) {
                            formatString += ('.' + arrPrice[1]);
                            value = arrPrice[0] + '.' + arrPrice[1];
                        }
                        break;
                    default:
                        formatString = value;
                        break;
                }
                $this.val(formatString);
                $this.prop('rawValue', value);
                return formatString;
            };

            _set();
            $this.on('input', function (e, a, b) {
                var $this = $(this);
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function () {
                    if ($this.prop('rawValue') !== _get()) {
                        var value = _set();
                        $this.trigger('formatinput', [value]);
                    }
                }, 10);
            });
        },
        exports: {},
        setOptionsBefore: null,
        setOptionsAfter: null,
        destroyBefore: null,
        initAfter: null,
        isThirdPart: false,
    };
    $.CUI.plugin(inputformatConfig);
    $(document).on('dom.load.inputformat', function () {
        $('[data-inputformat]').each(function (index, item) {
            var $this = $(item);
            $this.inputformat($this.data());
            $this.removeAttr('data-inputformat');
            $this.removeAttr('data-inputformat-load', '');
        });

    });
})(jQuery);
