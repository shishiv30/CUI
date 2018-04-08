//initial event
(function ($) {
    $(document).ready(function ($) {
        var _isMobile = function () {
            var $body = $('body');
            if($.isMobile()) {
                $body.addClass('mobile');
            } else {
                $body.addClass('desktop');
            }
        };
        var _isLandscap = function(){
            var $body = $('body');
            if($(window).height() > $(window).width()) {
                $body.addClass('portrait');
                $body.removeClass('landscape');
            } else {
                $body.addClass('landscape');
                $body.removeClass('portrait');
            }
        };
        var _eventKeyDownListener = function () {
            $(window).on('keydown', function (e) {
                var $focus = $(':focus');
                var tagName = $focus.length > 0 ? $focus.tagName : '';
                if(tagName !== 'INPUT' && tagName !== 'TEXTAREA') {
                    $(document).trigger('dom.keydown', [e]);
                }
            });
        };
        var originalScrollTop = 0;
        var isScrollDown;
        var _scrollTrigger = function (e) {
            //in mobile device the scroll will cause by focus in input
            var causeByKeyboard = $('input, select, textarea').is(':focus');
            var currentScrollTop = $(document).scrollTop();
            if(currentScrollTop > originalScrollTop) {
                isScrollDown = true;
            } else if(currentScrollTop < originalScrollTop) {
                isScrollDown = false;
            }
            originalScrollTop = currentScrollTop;
            $(document).trigger('dom.scroll', [e, isScrollDown, originalScrollTop, causeByKeyboard]);
        };
        var _eventScrollListener = function () {
            window.addEventListener('scroll', $.throttle(function (e) {
                _scrollTrigger(e);
            }, 500), true);
        };
        var _oringalWindowWidth = $(window).width();
        var _resizeTrigger = function (e) {
            var isWidthChange = _oringalWindowWidth != $(window).width();
            var causeByKeyboard = $('input, select, textarea').is(':focus');
            $(document).trigger('dom.resize', [e, causeByKeyboard, isWidthChange]);
        };
        var _eventResizeListener = function () {
            window.addEventListener('resize', $.debounce(function (e) {
                _isLandscap();
                _resizeTrigger(e);
            }, 100), true);
        };
        //dom load
        _isMobile();
        _isLandscap();
        _eventKeyDownListener();
        _eventScrollListener();
        _eventResizeListener();
    });
})(jQuery);
