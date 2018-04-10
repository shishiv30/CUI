//seed code for create a plugin
//replace all of the "header" with the plugin name. (the plugin name should be same as the js file name);

(function ($) {
    var headerConfig = {
        name: 'header',
        defaultOpt: {
            button: '.header-form-btn',
            container: 'html',
            autoclose: true,
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
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
            context = $.extend(context, {
                _show: _show,
                _hide: _hide,
                _close: _close,
                _open: _open,
            });
            $(document).on('dom.resize', function () {
                if ($container.hasClass('header-menu-show')) {
                    _hide();
                }
            });
            $(document).on('dom.scroll', function () {
                var status = $.CUI.status;
                if (status.isScrollDown) {
                    _close();
                } else {
                    _open();
                }
            });
        },
        exports: {
            show: function () {
                this._show();
            },
            hide: function () {
                this._hide();
            },
            close: function () {
                this._close();
            },
            open: function () {
                this._open();
            },
        },
        setOptionsBefore: null,
        setOptionsAfter: null,
        initBefore: null,
        initAfter: null,
        destroyBefore: null
    };
    $.CUI.plugin(headerConfig);
    $(document).on('dom.load.header', function () {
        $('[data-header]').each(function (index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.removeAttr('data-header');
            $this.header(data);
            $this.attr('data-header-load', '');
        });
    });
})(jQuery);
