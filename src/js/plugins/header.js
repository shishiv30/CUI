//favorite
(function ($) {
    $.fn.header = function (options) {
        var defaultOpt = {
            button: '.header-form-btn',
            menu: '.header-menu-list'
        };
        var opt = $.extend(defaultOpt, options);
        var $this = $(this);
        var $button = $this.find(opt.button);
        var $menu = $this.find(opt.menu);
        var $overlay = $('<div class="header-overlay"></div>');
        var _show = function () {
            $button.addClass("shown");
            $overlay.show();
            $menu.addClass("active");
            $("body,html").css("overflowY", "hidden");
        };
        var _hide = function () {
            $("body,html").css("overflowY", "auto");
            $button.removeClass("shown");
            $menu.removeClass("active");
            $overlay.hide();
        };
        $this.prepend($overlay);
        $button.on('click', function () {
            if ($menu.hasClass("active")) {
                _hide();
            } else {
                _show();
            }
        });
        $overlay.on('click', _hide);
        $this.data('header', {
            show: _show,
            hide: _hide
        });
        $(document).on("dom.resize", function () {
            if ($menu.hasClass("active")) {
                _hide();
            }
        });
    };
    $(document).on('dom.load', function () {
        $("[data-header]").each(function () {
            $(this).header({
                button: $(this).attr('data-button'),
                menu: $(this).attr('data-menu')
            });
            $(this).removeAttr('data-header');
        });
    });


})(jQuery);
