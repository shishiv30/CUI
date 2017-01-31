(function ($) {
    $.fn.inputformat = function (option) {
        var $this = $(this);
        var defaultOpt = {
            type: 'phone',
            fraction: ''
        };
        var opt = $.extend(defaultOpt, option);
        var timer = null;
        var _get = function () {
            var value = $this.val();
            switch (opt.type) {
                case 'phone':
                    return value.replace(/-/g, '');
                case 'price':
                    return value.replace(/,/g, '');
                default:
                    return value;
            }
        };
        var _set = function (programmatic) {
            var value = _get();
            var formatString = '';
            switch (opt.type) {
                case 'phone':
                    formatString = value;
                    var pattern = /(\d{3})(\d+)/;
                    while (pattern.test(formatString))
                        formatString = formatString.replace(pattern, '$1-$2');
                    break;
                case 'price':
                    var arrPrice = value.toString().split('.');
                    formatString = arrPrice[0];
                    var pricePattern = /(\d+)(\d{3})/;
                    while (pricePattern.test(formatString))
                        formatString = formatString.replace(pricePattern, '$1,$2');
                    if (arrPrice.length >= 2) {
                        formatString += ('.' + arrPrice[1]);
                    }
                    break;
                case 'rate':
                    var fraction = $.isInt(opt.fraction) ? opt.fraction : 2;
                    var arrRate = value.toString().split('.');
                    formatString = arrRate[0].replace(/[^0-9]/g, '');
                    if (fraction > 0 && arrRate.length > 1) {
                        var decimals = arrRate[1].length > fraction ? arrRate[1].substring(0, fraction) : arrRate[1];
                        decimals = decimals.replace(/[^0-9]/g, '');
                        if (decimals) {
                            formatString += '.' + decimals;
                        } else {
                            formatString += '.';
                        }
                    }
                    break;
                default:
                    formatString = value;
                    break;
            }
            $this.val(formatString);
            $this.prop('rawValue', value);
            if (!programmatic) {
                $this.trigger('formatinput', [formatString, value]);
            }
        };

        if ($.isInt($this.val())) {
            _set();
        }

        $this.on('keyup input change', function (e, programmatic) {
            var $this = $(this);
            if (timer) {
                clearTimeout(timer);
            }
            if ($this.prop('rawValue') !== _get()) {
                timer = setTimeout(function () {
                    _set(programmatic === true);
                }, 10);
            }
        });
    };
    $(document).on('dom.load.inputformat', function () {
        $('[data-inputformat]').each(function (index, item) {
            var $this = $(item);
            $this.inputformat($this.data());
            $this.removeAttr('data-inputformat');
            $this.removeAttr('data-inputformat-load', '');
        });

    });
})(jQuery);
