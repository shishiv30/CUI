//form submit
(function($) {
    $.fn.submitForm = function(options) {
        var $this = $(this);
        var defaultOpt = {
            target: '',
            type: null,
            beforesend: null,
            onsuccess: null,
            onerror: null,
            datatype: null,
            lock: 1,
        };
        var opt = $.extend({}, defaultOpt, options);
        var obj = {
            send: function() {
                if ($this.is('[disabled]')) {
                    return false;
                }
                var params = {
                    type: opt.type,
                    dataType: opt.datatype,
                    lock: opt.lock
                };

                if (opt.target) {
                    var $target = $(opt.target);
                    if ($target.isValid()) {
                        params.data = $target.formValue();
                    } else {
                        return false;
                    }
                }

                params.beforeSend = function() {
                    if ($.isFunction(opt.beforesend)) {
                        opt.beforesend(opt);
                    } else {
                        $(document).trigger(opt.beforesend, [opt]);
                    }
                };
                params.success = function() {
                    if ($.isFunction(opt.onsuccess)) {
                        opt.onsuccess(opt);
                    } else {
                        $(document).trigger(opt.onsuccess, [$this, opt]);
                    }
                };
                params.error = function() {
                    if ($.isFunction(opt.onerror)) {
                        opt.onerror(opt);
                    } else {
                        $(document).trigger(opt.onerror, [$this, opt]);
                    }
                };
                $.ajax(params);
            },
            setOption: function(key, value) {
                opt[key] = value;
            },
            setOptions: function(options) {
                $.extend(opt, options);
            }
        };

        $this.click(obj.send);
        $this.data('submit', obj);
        $this.attr('role', 'SubmitForm');
        return obj;
    };
    $(document).on('dom.load.submit', function() {
        $('[data-submit]').each(function() {
            var $this = $(this);
            if ($this.attr('data-target')) {
                var $form = $($this.attr('data-target'));
                $form.on('keyup', function(e) {
                    if (e.keyCode === 13) {
                        //when focus on textarea will not auto submit
                        if ($('textarea:focus').length === 0) {
                            $this.click();
                        }
                    }
                });
            }
        });
    });

    $(document).on('dom.load', function() {
        $('[data-submit]').each(function(index, item) {
            var $item = item;
            $item.submitForm($item.data());
            $item.removeAttr('data-submit');
        });
    });
})(jQuery);
