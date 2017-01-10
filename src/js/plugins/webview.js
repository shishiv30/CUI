(function ($) {
    $.fn.webview = function () {
        var $this = $(this);
        $this.css({overflow: 'hidden'});
        var webviewInfo = {};
        var _getWebviewInfo = function () {
            webviewInfo['maxTop'] = $this.outerHeight() + $this.prop('scrollHeight');
            webviewInfo['maxLeft'] = $this.outerWidth() + $this.prop('scrollWidth');
            webviewInfo['scrollTop'] = $this.scrollTop();
            webviewInfo['scrollLeft'] = $this.scrollLeft();
        };
        var touchStart = null;
        var _getTouchInfo = function (e) {
            return {
                x: e.originalEvent.touches[0].pageX,
                y: e.originalEvent.touches[0].pageY
            };
        }
        var _move = function (point) {
            var offsetTop = touchStart.y - point.y;
            var offsetLeft = touchStart.x - point.x;
            var top = webviewInfo.scrollTop + offsetTop;
            var left = webviewInfo.scrollLeft + offsetLeft;
            $this.scrollTop(top);
            $this.scrollLeft(left);
        };
        _getWebviewInfo();
        $this.on('touchstart', function (e) {
            touchStart = _getTouchInfo(e);
        });
        $this.on('touchmove', function (e) {
            _move(_getTouchInfo(e));
        });
        $this.on('touchend', function () {
            _getWebviewInfo();
        });

        $this.on('mousewheel', function (e) {
            if (e.originalEvent.wheelDelta / 120 > 0) {
                $(this).text('scrolling up !');
            }
            else {
                $(this).text('scrolling down !');
            }
        });

    };
    $(document).on('dom.load', function () {
        $('[data-webview]').each(function () {
            $(this).webview();
            $(this).removeAttr('data-webview');
        });
    });
})(jQuery);