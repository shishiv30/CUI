//initial event
(function ($) {
    $.CUI.status = {};
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
        $.CUI.status.scrollTop = $(window).scrollTop();
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
        $(window).on('scroll', $.throttle(function () {
            _updateWindowStatus('scroll');
            $(document).trigger('dom.scroll');
        }, 200));
    };
    var _eventResizeListener = function () {
        $(window).on('resize', $.debounce(function () {
            _updateWindowStatus('resize');
            $(document).trigger('dom.resize');
        }, 500));
    };
    _updateWindowStatus('inital');
    //dom load
    _isMobile();
    _eventScrollListener();
    _eventResizeListener();
    $(document).one('cui.inital',function(){
        $.CUI.status = {
            originalScrollTop: $(window).scrollTop(),
            isLandscape: $(window).width() >$(window).height(),
            scrollTop: $(window).scrollTop(),
            causeByKeyboard: false,
            isScrollDown: false,
            height: $(window).height(),
            width: $(window).width()
        };
        $(document).trigger('dom.load');
    });
})(jQuery);
