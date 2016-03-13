(function($) {
    $.fn.fulidvideo = function() {
        var $this = $(this);

        if ($this.closest('.video-wrap').length == 0) {
            $this.wrap('<div class="video-wrap"></div>');
        }
    }
    $(document).on("dom.load", function() {
        $("[data-fulidvideo]").each(function() {
            $(this).find("iframe").each(function(index, item) {
                $(item).fulidvideo();
            });
            $(this).removeAttr('data-fulidvideo');
        });

    });
})(jQuery);