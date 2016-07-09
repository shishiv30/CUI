//tip
(function ($) {
    $.fn.tip = function (option) {
        var opt = $.extend({}, option);
        var type = option.type || 'normal';
        delete option.type;

        var config = {
            normal: {
                placement: option.position || 'top',
                trigger: 'hover focus'
            },
            error: {
                placement: option.position || 'bottom',
                template: '<div class="tooltip error" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                trigger: 'manual',
                html: true,
            },
            warning: {
                placement: option.position || 'top',
                template: '<div class="tooltip warning" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                trigger: 'manual',
                html: true,
            },
            info: {
                placement: option.position || 'top',
                template: '<div class="tooltip info" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                trigger: 'manual',
                html: true,
            },
        };
        opt = $.extend(opt, config[type]);

        $(this).tooltip(opt);
    };
    var inital = function () {
        $("[data-tip]").each(function () {
            $(this).tip({
                type: $(this).attr('data-tip'),
                position: $(this).attr('data-position')
            });
            $(this).removeAttr("data-tip");
            $(this).attr('role', 'Tip');
        });
    };
    $(document).on('dom.load', function () {
        inital();
    });
})(jQuery);