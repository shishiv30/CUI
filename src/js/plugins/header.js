//seed code for create a plugin
//replace all of the "header" with the plugin name. (the plugin name should be same as the js file name);
(function ($) {
    var headerConfig = {
        name: 'header',
        defaultOpt: {
            container: 'html',
            autoclose: true,
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            var $nav = $this.find('.header-nav');
            var $list = $this.find('.header-menu-list');
            var $scrollLinkLeft = $('<a class="header-scroll-link left"><i class="icon-caret-left"></i></a>');
            var $scrollLinkRight = $('<a class="header-scroll-link right"><i class="icon-caret-right"></i></a>');
            var $overlay = $('<div class="header-overlay"></div>');
            var $swtichLink = $this.find('.header-switch-link');
            var $items = $list.children('li');
            var max = 0;
            var buffer = 5;
            $nav.append($scrollLinkLeft);
            $nav.append($scrollLinkRight);
            $this.prepend($overlay);
            var checkScrollable = function () {
                max = $list.prop('scrollWidth') - $list.outerWidth();
                if(max < buffer) {
                    $nav.removeClass('scrollable');
                } else {
                    $nav.addClass('scrollable');
                }
            };
            var checkScrollLink = function () {
                var scroll = $list.scrollLeft();
                if(scroll <= buffer) {
                    $scrollLinkLeft.removeClass('visable');
                    $scrollLinkRight.addClass('visable');
                } else if(scroll >= (max - buffer)) {
                    $scrollLinkLeft.addClass('visable');
                    $scrollLinkRight.removeClass('visable');
                } else {
                    $scrollLinkLeft.addClass('visable');
                    $scrollLinkRight.addClass('visable');
                }
            };
            //nav-list
            $list.on('scroll', $.throttle(checkScrollLink, 100));
            $(document).on('dom.resize', checkScrollable);
            checkScrollable();
            checkScrollLink();
            var _close = function () {
                $this.addClass('header-close');
            };
            var _open = function () {
                $this.removeClass('header-close');
            };
            var _show = function () {
                $this.addClass('expand');
            };
            var _hide = function () {
                $this.removeClass('expand');
            };
            $overlay.on('click', _hide);
            //nav
            $items.on('touchstart', function () {
                $nav.toggleClass('active');
            });
            $items.on('mouseenter', function () {
                $nav.addClass('active');
            });
            $items.on('mouseleave', function () {
                $nav.removeClass('active');
            });
            $items.find('a').on('click', function () {
                $(this).closest('li').toggleClass('hover');
            });
            $swtichLink.on('click', function () {
                if($this.hasClass('expand')) {
                    _hide();
                } else {
                    _show();
                }
            });
            $scrollLinkLeft.on('click', function () {
                $list.stop().animate({
                    scrollLeft: '-=100px'
                });
            });
            $scrollLinkRight.on('click', function () {
                $list.stop().animate({
                    scrollLeft: '+=100px'
                });
            });
            context = $.extend(context, {
                _show: _show,
                _hide: _hide,
                _close: _close,
                _open: _open,
            });
            $(document).on('dom.resize', _hide);
            $(document).on('dom.scroll', function () {
                var status = $.CUI.status;
                if(status.isScrollDown) {
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
$(document).ready(function () {
    $(document).trigger('cui.inital');
});
