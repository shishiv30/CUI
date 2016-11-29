(function($) {
    $.fn.textbox = function() {
        var $this = $(this);
        var $input = $this.find('input');
        $input.on('focusin', function() {
            $this.addClass('focus');
        });
        $input.on('focusout', function() {
            if (!$input.val()) {
                $this.removeClass('focus');
            }
        });
        if ($input.val()) {
            $this.addClass('focus');
        } else {
            $this.removeClass('focus');
        }
    };
    $(document).on('dom.load', function() {
        $('[data-textbox]').each(function(index, item) {
            $(item).textbox();
            $(item).removeAttr('data-textbox');
            $(item).attr('data-textbox-load', '');
        });
    });
})(jQuery);
