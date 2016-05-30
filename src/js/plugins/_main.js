"use strict";
window.context = {};
//initial event
(function($) {
    $(document).ready(function($) {
        //ismobile
        if($.isMobile()){
          $("#body").addClass('mobile');
        }else{
          $("#body").addClass('desktop');
        }
        //dom scroll
        var scrollTimer;
        var initTop = 0;
        $(window).on("scroll", function(e) {
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }
            scrollTimer = setTimeout(function() {
                var causeByKeyboard =  $('input, select, textarea').is(":focus");
                var scrollTop = $(document).scrollTop();
                var isDown = false;
                if (scrollTop > initTop) {
                    isDown = true;
                }
                initTop = scrollTop;
                $(document).trigger('dom.scroll', [e, isDown, initTop,causeByKeyboard]);
            }, 100);
        });
        //keydown
        $(window).on("keydown", function(e) {
            $(document).trigger('dom.keydown', [e]);
        });
        //resize
        var resizeTimer;
        $(window).on("resize", function(e) {
            var causeByKeyboard =  $('input, select, textarea').is(":focus");
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }
            resizeTimer = setTimeout(function() {
                $(document).trigger('dom.resize', [e,causeByKeyboard]);
            }, 50);
        });
        //dom load
        $(document).trigger('dom.load');
    });
})(jQuery);
