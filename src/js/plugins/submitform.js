//form submit
(function($) {
    $.fn.submitForm = function(options) {
        var $this = $(this);
        var defaultOpt = {
            target: "",
            lock: 1,
        };
        var opt = $.extend({}, defaultOpt, options);
        var obj = {
            send: function() {
                if ($this.is("[disabled]")) {
                    return false;
                }
                var params = {
                    type: opt.type,
                    beforeSend: opt.beforeSend,
                    success: opt.success,
                    error: opt.error,
                    dataType: opt.dataType,
                    trigger: $this,
                    lock: opt.lock
                };
                var methodName = opt.methodName;

                if (opt.target) {
                    var $target = $(opt.target);
                    if ($target.isValid()) {
                        params.data = $target.formValue();
                    } else {
                        return false;
                    }
                }

                if ($.isFunction(commonService[methodName])) {
                    commonService[methodName](params);
                }
            },
            setOption: function(key, value) {
                opt[key] = value;
            },
            setOptions: function(options) {
                $.extend(opt, options);
            }
        };

        $this.click(obj.send);
        $this.data("submit", obj);
        $this.attr('role','SubmitForm');
        return obj;
    };
    $(document).on('dom.load.submit', function() {
        $('[data-submit]').each(function() {
            var $this = $(this);
            if ($this.attr("data-target")) {
                var $form = $($this.attr("data-target"));
                $form.on('keyup', function(e) {
                    if (e.keyCode === 13) {
                        //when focus on textarea will not auto submit
                        if ($("textarea:focus").length === 0) {
                            $this.click();
                        }
                    }
                });
            }
        });
    });
    $(document).on('click.submit', '[data-submit]', function() {
        var $this =$(this);
        var methodName = $this.attr('data-submit');
        if (methodName) {
            var opt = {
                methodName: methodName,
                target: $this.attr('data-target'),
                type: $this.attr('data-type'),
                dataType: $this.attr('data-dataType'),
                beforeSend: $this.attr('data-beforeSend'),
                success: $this.attr('data-success'),
                error: $this.attr('data-error'),
                lock: $this.attr('data-lock'),
            };

            if (!opt.success) {
                opt.success = feedback(methodName);
            }

            var obj = $this.submitForm(opt);
            $this.removeAttr('data-submit');

            if (obj) {
                obj.send();
            }
        }
    });
})(jQuery);
