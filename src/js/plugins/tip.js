//tip
(function($) {
    var Tip = {
        defaultOpt: {
            traget: null,
            height: 50,
            width: 320,
            theme: 'normal',
            placement: 'top',
            trigger: 'click',
            html: true,
            beforeshow: null,
            onshow: null,
            beforehide: null,
            onhide: null,
        },

        opt: null,
        create: function(element, option) {
            var tip = {};
            var opt = $.extend({}, Tip.defaultOpt, option);
            var $container = $('<div class="tooltip ' + opt.theme + ' ' + opt.placement + '" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>');
            var $element = $(element);
            $container.hide();
            $element.after($container);
            return {

                $element: $(element),
            }
        },

    };

    tip.prototype._show = function() {
        if (opt.beforeshow) {
            if ($.isFunction(opt.beforeshow)) {
                opt.beforeshow($this);
            } else {
                $(document).trigger(opt.beforeshow, [$this]);
            }
        }
        if (opt.content) {
            $container.find('.tooltip-inner').html(opt.content);
        }
        $container.show();
        if (opt.onshow) {
            if ($.isFunction(opt.onshow)) {
                opt.onshow($this);
            } else {
                $(document).trigger(opt.onshow, [$this]);
            }
        }
    };
    tip.prototype._hide = function() {
        if (opt.beforehide) {
            if ($.isFunction(opt.beforehide)) {
                opt.beforehide($this);
            } else {
                $(document).trigger(opt.beforehide, [$this]);
            }
        }
        $container.hide();
        if (opt.onhide) {
            if ($.isFunction(opt.onhide)) {
                opt.onhide($this);
            } else {
                $(document).trigger(opt.onhide, [$this]);
            }
        }
    };
    tip.prototype._destroy = function() {
        $container.remove();
        $this.data('tip', null);
    };
    tip.prototype._toggle = function() {
        if ($container.is(':hidden')) {
            _show();
        } else {
            _hide();
        }
    };
    tip.prototype._setOptions = function(option) {
        opt = $.extend(opt, option);
    };
    tip.prototype.init = function() {
        switch (opt.trigger) {
            case 'click' :
                $this.on('click', function() {
                    _toggle();
                });
                break;
            case 'hover' :
                $this.on('hover', function() {
                    _show();
                }, function() {
                    _hide();
                });
                break;
        }
    };
    $.fn.tip = function(option) {
        var $this = $(this);

        if ($this.data('tip')) {
            if (option) {
                _setOptions(option);
            }
            return $this.data('tip');
        }

        var obj = {
            hide: _hide,
            show: _show,
            toggle: _toggle,
            destroy: _destroy,
            setOptions: _setOptions
        }
        $this.data('tip', obj);
        return obj;
        // var config = {
        //     normal: {
        //         placement: option.position || 'top',
        //         trigger: 'hover focus'
        //     },
        //     error: {
        //         placement: option.position || 'bottom',
        //         template: '<div class="tooltip error" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        //         trigger: 'manual',
        //         html: true,
        //     },
        //     warning: {
        //         placement: option.position || 'top',
        //         template: '<div class="tooltip warning" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        //         trigger: 'manual',
        //         html: true,
        //     },
        //     info: {
        //         placement: option.position || 'top',
        //         template: '<div class="tooltip info" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        //         trigger: 'manual',
        //         html: true,
        //     },
        // };
        // opt = $.extend(opt, config[type]);
    };
    var inital = function() {
        $('[data-tip]').each(function() {
            $(this).tip({
                type: $(this).attr('data-tip'),
                position: $(this).attr('data-position')
            });
            $(this).removeAttr('data-tip');
            $(this).attr('role', 'Tip');
        });
    };
    $(document).on('dom.load', function() {
        inital();
    });
})(jQuery);