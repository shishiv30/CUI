//favorite
(function ($) {
    $.fn.header = function (options) {
        var defaultOpt = {
            button: '.header-form-btn',
            container: 'html',
            autoclose: true,
        };
        var opt = $.extend(defaultOpt, options);
        var $this = $(this);
        var $button = $this.find(opt.button);
        var $container = $(opt.container);
        var $menus = $this.find('[data-headermenu]');
        var $overlay = $this.find('.header-overlay');
        var _close = function () {
            $this.addClass('header-close');
        };
        var _open = function () {
            $this.removeClass('header-close');
        };
        var _show = function () {
            $container.addClass('header-menu-show');
        };
        var _hide = function () {
            $container.removeClass('header-menu-show');
        };
        $button.on('click', function () {
            if ($container.hasClass('header-menu-show')) {
                _hide();
            } else {
                _show();
            }
        });
        $menus.children('a').click(function () {
            $(this).parent().toggleClass('active');
        });
        $overlay.on('click', _hide);
        $this.data('header', {
            show: _show,
            hide: _hide,
            close: _close,
            open: _open,
        });
        $(document).on('dom.resize', function () {
            if ($container.hasClass('header-menu-show')) {
                _hide();
            }
        });
        $(document).on('dom.scroll', function (e, t, isDown) {
            if (isDown) {
                _close();
            } else {
                _open();
            }
        });
    };
    $(document).on('dom.load', function () {
        $('[data-header]').each(function () {
            $(this).header();
            $(this).removeAttr('data-header');
        });
    });


})(jQuery);
