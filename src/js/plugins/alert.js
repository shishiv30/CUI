(function () {
    'use strict';

    var getPosition = function (alert, element, relativePosition) {
        var alertWidth = alert.outerWidth();
        var alertHeight = alert.outerHeight();
        if (!element) {
            return {
                top: '50%',
                left: '50%',
                marginLeft: ('-' + alertWidth / 2 + 'px'),
                marginTop: ('-' + alertHeight / 2 + 'px'),
            };
        }
        var offset = $(element).offset();
        var height = $(element).outerHeight();
        var width = $(element).outerWidth();
        return {
            top: relativePosition === 'bottom' ? (offset.top + height + 20) + 'px' : (offset.top - alertHeight - 20) + 'px',
            left: alertHeight <= width ? (offset.left + (width / 2 - alertWidth / 2)) + 'px' : (offset.left - (alertWidth / 2 - width / 2)) + 'px'
        };
    };

    $.alert = function (options) {
        var defaultOpt = {
            text: '',
            target: null,
            relative: '',
            relativePosition: 'bottom',
            timeout: 3000,
            top: 0,
            style: 'error',
            autoClose: true,
            width: 'auto'
        };
        var height = 0;
        var width = 0;
        var opt = $.extend({}, defaultOpt, options);
        var target = opt.target ? $(opt.target) : $('body');
        var alert = $('<div class="alert ' + opt.style + '" style="width:' + opt.witdh + '">' + opt.text + '</div>');
        target.after(alert);

        var pos = getPosition(alert, opt.relative, opt.relativePosition);

        if (opt.target) {
            height = target.height();
            width = target.width();
            alert.css({
                position: 'absolute',
                top: opt.top + height,
                left: 0,
                right: 0
            });
        } else {
            alert.css($.extend({
                position: 'fixed'
            }, pos));
        }
        alert.css('opacity', '1');
        if (opt.autoClose === true) {
            setTimeout(function () {
                alert.remove();
            }, opt.timeout);
        }
        return alert;
    };

    $.fn.alert = function (options) {
        var $this = $(this);
        var defaultOpt = {
            text: '',
            title: '<i class="icon-warning"></i> Error',
            html: true,
            theme: "error",
            trigger: "manual",
            placement: "bottom",
            showFirst: true,
            forceDestroy: true,
            onHide: null,
            onShow: null
        };
        var opt = $.extend(defaultOpt, options);
        var tmp = '<div class="popover ' + opt.theme + '" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>';

        $this.popover({
            title: opt.title,
            content: opt.text || opt.content,
            html: true,
            template: tmp,
            trigger: opt.trigger,
            placement: opt.placement
        });
        opt.forceDestroy && $this.on('shown.bs.popover', function () {
            if (opt.onShow) {
                if ($.isFunction(opt.onShow)) {
                    opt.onShow($this);
                } else {
                    $(document).trigger(opt.onShow, [$this]);
                }
            }
            $(document).one('click', function () {
                $this.popover('destroy');
            });
        });
        if (opt.onHide) {
            $this.on('hidden.bs.popover', function () {
                if ($.isFunction(opt.onHide)) {
                    opt.onHide($this);
                } else {
                    $(document).trigger(opt.onHide, [$this]);
                }
            });
        }

        opt.showFirst && $this.popover('show');
    }
})(jQuery);
