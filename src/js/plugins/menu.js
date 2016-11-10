//menu
(function($) {
    $.fn.menu = function(option) {
        var defaultOption = {
            type: 'appear'
        };
        var opt = $.extend(
            defaultOption, option
        );
        var $this = $(this);
        var $list = $this.find('ul');
        var $link = $this.find('>a');
        var show = function() {
            $(document).trigger('mouseup.menu');
            $link.addClass('active');
            $list.addClass('active');
            $list.show();
            $(document).off('mouseup.menu').one('mouseup.menu', function() {
                hide();
            });
        };
        var hide = function() {
            $link.removeClass('active');
            $list.removeClass('active');
            $list.hide();
        };
        var expand = function() {
            $(document).trigger('mouseup.menu');
            $link.addClass('active');
            $list.addClass('active');
            $list.css({
                height: $list.prop('scrollHeight')
            });
            $(document).off('mouseup.menu').one('mouseup.menu', function() {
                close();
            });
        };
        var close = function() {
            $link.removeClass('active');
            $list.removeClass('active');
            $list.css({
                height: 0
            });
        };


        var menu = {
            toggle: function() {
                if ($list.is(':hidden') || $list.prop('offsetHeight') === 0) {
                    if (opt.type == 'expand') {
                        expand();
                    } else {
                        show();
                    }
                } else {
                    if (opt.type == 'expand') {
                        close();
                    } else {
                        hide();
                    }
                }
            }
        };

        $link.mouseup(function() {
            return false;
        });
        $list.mouseup(function() {
            return false;
        });

        //todo posision
        if (opt.type == 'expand') {
            close();
        } else {
            hide();
        }
        $link.click(menu.toggle);
        $this.data('menu', menu);
        $this.attr('role', 'Menu');
        return menu;
    };
    $(document).on('dom.load', function() {
        $('[data-menu]').each(function(index, item) {
            $(item).menu({
                type: $(item).attr('data-menu')
            });
            $(item).removeAttr('data-menu');
        });
    });
})(jQuery);
