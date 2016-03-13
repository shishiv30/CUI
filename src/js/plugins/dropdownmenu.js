(function($) {

    $.fn.dropdownmenu = function() {
        var $this = $(this);
        var $link = $(this).find('.caret');
        var $item = $(this).find('.dropdown-item');
        var timer = null;

        var checkOverFlow = function() {
            $this.find('li').removeClass('fullline');
            var showLink = false;
            var top = $item.find('li:eq(0)').offset().top;
            $item.find('li').removeClass('first');
            $item.find('li').each(function(index, item) {
                if (($(item).offset().top - top) < 10 && ($(item).offset().top - top) > -10) {
                    $(item).removeClass('fullline');
                } else {
                    $(item).addClass('fullline');
                    showLink = true;
                }
            });
            $item.find('.fullline:eq(0)').addClass('first');

            if (showLink) {
                $link.show();
            } else {
                $link.hide();
            }
        };

        var expand = function() {
            $this.addClass('active');
        };

        var close = function() {
            $this.removeClass('active');
        };

        var toggle = function() {
            if ($this.hasClass('active')) {
                close();
            } else {
                $(document).trigger('mouseup.dropdownmenu');
                expand();
                $(document).off('mouseup.dropdownmenu').one('mouseup.menu', function(e) {
                    close();
                });
            }
        };

        var namespace = {
            expand: expand,
            this: this,
            toggle: toggle,
            refresh:checkOverFlow
        };

        $link.mouseup(function() {
            return false;
        });

        $link.on('click', toggle);

        $(document).on('dom.resize', function() {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function() {
                checkOverFlow();
            }, 200);
        });
        checkOverFlow();
        $this.attr('role','Dropdownmenu');
        return $this.data('dropdownmenu', namespace);
    }

    $(document).on('dom.load.dropdownmenu', function() {
        $('[data-dropdownmenu]').each(function(index, item) {
            $(item).dropdownmenu();
            $(item).removeAttr('data-dropdownmenu');
        });
    });

})(jQuery);
