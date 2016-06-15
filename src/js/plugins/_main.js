"use strict";
window.context = {};
//initial event
(function ($) {
    $(document).ready(function ($) {
        //ismobile
        if ($.isMobile()) {
            $("#body").addClass('mobile');
        } else {
            $("#body").addClass('desktop');
        }

        //keydown
        $(window).on("keydown", function (e) {
            var tagName = $(":focus").length > 0 ? $(":focus")[0].tagName : '';
            if (tagName !== "INPUT" && tagName !== "TEXTAREA") {
                $(document).trigger('dom.keydown', [e]);
            }
        });

        //dom scroll
        var scrollTimer;
        var initTop = 0;
        var scrollTrigger = function (e) {
            //in mobile device the scroll will cause by focus in input
            var causeByKeyboard = $('input, select, textarea').is(":focus");
            var scrollTop = $(document).scrollTop();
            var isDown = false;
            if (scrollTop > initTop) {
                isDown = true;
            }
            initTop = scrollTop;
            $(document).trigger('dom.scroll', [e, isDown, initTop, causeByKeyboard]);
        }
        $(window).on("scroll", function (e) {
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            } else {
                scrollTrigger(e);
            }
            scrollTimer = setTimeout(scrollTrigger, 100);
        });

        //resize
        var resizeTimer;
        var resizeTrigger = function (e) {
            var causeByKeyboard = $('input, select, textarea').is(":focus");
            $(document).trigger('dom.resize', [e, causeByKeyboard]);
        }
        $(window).on("resize", function (e) {
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            } else {
                resizeTrigger(e);
            }
            resizeTimer = setTimeout(resizeTrigger, 100);
        });
        //dom load
        $(document).trigger('dom.load');
    });
})(jQuery);
