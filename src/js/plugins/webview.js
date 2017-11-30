(function($) {
    $.fn.webview = function() {
        var $this = $(this);
        var webviewInfo = {};
        var eventlist = null;
        var _getPonitInfo = null;
        var _init = function() {
            $this.css({overflow: 'hidden'});

            if ($.isMobile()) {
                eventlist = {
                    start: 'touchstart',
                    moveing: 'touchmove',
                    end: 'touchend'
                };
                _getPonitInfo = function(e) {
                    return {
                        x: e.originalEvent.touches[0].pageX,
                        y: e.originalEvent.touches[0].pageY
                    };
                };
            } else {
                eventlist = {
                    start: 'moursedown',
                    moveing: 'mousemove',
                    end: 'mourseup'
                };
                _getPonitInfo = function(e) {
                    return {
                        x: e.originalEvent.pageX,
                        y: e.originalEvent.pageY
                    };
                };
            }
        };

        var _getWebviewInfo = function() {
            webviewInfo['maxTop'] = $this.outerHeight() + $this.prop('scrollHeight');
            webviewInfo['maxLeft'] = $this.outerWidth() + $this.prop('scrollWidth');
            webviewInfo['scrollTop'] = $this.scrollTop();
            webviewInfo['scrollLeft'] = $this.scrollLeft();
        };
        var pointStart = null;

        var _move = function(point) {
            var offsetTop = pointStart.y - point.y;
            var offsetLeft = pointStart.x - point.x;
            var top = webviewInfo.scrollTop + offsetTop;
            var left = webviewInfo.scrollLeft + offsetLeft;
            $this.scrollTop(top);
            $this.scrollLeft(left);
        };
        _getWebviewInfo();
        $this.on(eventlist.start, function(e) {
            pointStart = _getPonitInfo(e);
        });
        $this.on(eventlist.moving, function(e) {
            _move(_getPonitInfo(e));
        });
        $this.on(eventlist.end, function() {
            _getWebviewInfo();
        });

        $this.on('mousewheel', function(e) {
            $this.scrollTop($this.scrollTop() + e.originalEvent.wheelDelta);
        });

        _init();

    };
    $(document).on('dom.load', function() {
        $('[data-webview]').each(function() {
            $(this).webview();
            $(this).removeAttr('data-webview');
        });
    });
})(jQuery);