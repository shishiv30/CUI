//initial event
(function ($) {
    $.CUI.status = {
        originalScrollTop: null,
        isLandscape: null,
        scrollTop: null,
        causeByKeyboard: null,
        isScrollDown: null,
        height: null,
        width: null
    };
    var _isMobile = function () {
        var $body = $('body');
        if($.isMobile()) {
            $body.addClass('mobile');
        } else {
            $body.addClass('desktop');
        }
    };
    var _isLandscap = function () {
        var $body = $('body');
        $.CUI.status.width = $(window).width();
        $.CUI.status.height = $(window).height();
        $.CUI.status.isLandscape = $.CUI.status.width > $.CUI.status.height;
        if($.CUI.status.isLandscape) {
            $body.addClass('landscape');
            $body.removeClass('portrait');
        } else {
            $body.addClass('portrait');
            $body.removeClass('landscape');
        }
    };
    var _isScrollDown = function () {
        $.CUI.status.scrollTop = $(document).scrollTop();
        if($.CUI.status.scrollTop > $.CUI.status.originalScrollTop) {
            $.CUI.status.isScrollDown = true;
        } else if($.CUI.status.scrollTop < $.CUI.status.originalScrollTop) {
            $.CUI.status.isScrollDown = false;
        }
        $.CUI.status.originalScrollTop = $.CUI.status.scrollTop;
    };
    var _updateWindowStatus = function (type) {
        $.CUI.status.causeByKeyboard = $('input, select, textarea').is(':focus');
        switch(type) {
        case 'resize':
            _isScrollDown();
            _isLandscap();
            break;
        case 'scroll':
            _isScrollDown();
            break;
        case 'load':
            break;
        case 'inital':
            _isScrollDown();
            _isLandscap();
            break;
        default:
            break;
        }
        return status;
    };
    var _eventScrollListener = function () {
        window.addEventListener('scroll', $.debounce(function () {
            _updateWindowStatus('scroll');
            $(document).trigger('dom.scroll');
        }, 200), true);
    };
    var _eventResizeListener = function () {
        window.addEventListener('resize', $.throttle(function () {
            _updateWindowStatus('resize');
            $(document).trigger('dom.resize');
        }, 500), true);
    };
    _updateWindowStatus('inital');
    //dom load
    _isMobile();
    _eventScrollListener();
    _eventResizeListener();
})(jQuery);
