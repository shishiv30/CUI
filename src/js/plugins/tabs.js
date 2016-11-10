//tab
(function ($) {
    $.fn.tabs = function () {
        var $this = $(this);

        function toggle($item) {
            //hide all
            var item = $this.find('[data-tab]');
            item.removeClass('active');
            item.each(function (index, item) {
                var target = $(item).attr('data-target');
                $(target).hide();
            });
            //show click one
            var target = $item.attr('data-target');
            $item.addClass('active');
            $(target).show();
        }

        $this.find('[data-tab]').each(function (index, item) {
            var $item = $(item);
            if ($($item.attr('data-target')).length > 0) {

                if ($item.hasClass('active')) {
                    toggle($item);
                }
                $item.click(function () {
                    toggle($(this));
                });
            } else {
                $item.hide();
            }
        });
        $this.attr('role', 'Tabs');
    };

    $(document).on('dom.load.tabs', function () {
        $('[data-tabs]').each(function (index, item) {
            $(item).tabs();
            $(item).removeAttr('data-tabs');
        });
    });
})(jQuery);
