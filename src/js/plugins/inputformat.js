(function($) {
    $.fn.inputformat = function(option) {
        var $this = $(this);
        var defaultOpt = {
            type: "phone"
        };
        var opt = $.extend(defaultOpt, option);
        var timer = null;

        var _formatInput = function(value) {
            var formatString = "";
            switch (opt.type) {
                case "phone":
                    if (value.length >= 4) {
                        formatString += value.slice(0, 3) + "-";
                        if (value.length >= 7) {
                            formatString += value.slice(3, 6) + "-";
                            formatString += value.slice(6, value.length);
                        } else {
                            formatString += value.slice(3, value.length);
                        }
                    } else {
                        formatString += value;
                    }

                    break;
            }
            return formatString;
        }

        if ($.isInt($this.val())) {
            var formatString = _formatInput($this.val());
            $this.prop("rawValue", $this.val());
            $this.val(formatString);
        }

        $this.on("keyup", function() {
            var $this = $(this);
            var value = $this.val().replace(/-/g, "");
            if (timer) {
                clearTimeout(timer);
            }

            var formatString = _formatInput(value);
            $this.prop("rawValue", value);
            $this.val(formatString);

        });
        $this.attr('role','PhoneInput');
    }
})(jQuery);
