//Extend touch event
(function ($) {
    var _getDist = function (eventInfo) {
        var x = (eventInfo.touches[0].pageX - eventInfo.touches[1].pageX);
        var y = (eventInfo.touches[0].pageY - eventInfo.touches[1].pageY);
        return Math.sqrt(x * x + y * y);
    };
    var _getInfo = function (eventInfo) {
        var arry = Array.prototype.slice.call(eventInfo.touches);
        return {
            touches: arry.map(function (e) {
                return {
                    pageX: e.pageX,
                    pageY: e.pageY
                };
            })
        };
    };
    var eventSetting = {
        setup: function () {
            var $this = $(this);
            $this.off("touchstart.cui").on("touchstart.cui", function () {
                var $ele = $(this);
                $ele.data('_touchStart', null);
                $ele.data('_touchEnd', null);
                return false;
            });
            $this.off("touchmove.cui").on('touchmove.cui', $.throttle(function (e) {
                var $ele = $(this);
                var event = _getInfo(e.originalEvent);
                if (!$ele.data('_touchStart')) {
                    $ele.data('_touchStart', event);
                } else {
                    if ($ele.data('_touchStart').touches.length == 1 && event.touches.length == 2) {
                        $ele.data('_touchStart', event);
                    }
                }
                if ($ele.data('_touchStart').touches.length == 2 && event.touches.length == 1) {
                    return;
                } else {
                    $ele.data('_touchEnd', event);
                }
                $ele.trigger('moving', [$ele.data('_touchStart'), event]);
                return false;
            }, 100));

            $this.off("touchend.cui").on("touchend.cui", function () {
                var $ele = $(this);
                var start = $ele.data('_touchStart');
                var end = $ele.data('_touchEnd');

                if (start && end) {
                    if (start.touches.length == 2) {
                        var startDistance = _getDist(start);
                        var endDistance = _getDist(end);
                        if (startDistance > endDistance) {
                            $ele.trigger('pinchin', [start, end]);
                        } else if (startDistance < endDistance) {
                            $ele.trigger('pinchout', [start, end]);
                        }
                    } else if (start.touches.length == 1) {
                        var xDistance = start.touches[0].pageX - end.touches[0].pageX;
                        var yDistance = start.touches[0].pageY - end.touches[0].pageY;
                        if (Math.abs(xDistance) > Math.abs(yDistance) * 5) {
                            if (xDistance !== 0) {
                                if (xDistance > 0) {
                                    $ele.trigger('swipeleft', [start, end]);
                                } else {
                                    $ele.trigger('swiperight', [start, end]);
                                }
                            }
                        } else if (Math.abs(xDistance) * 5 < Math.abs(yDistance)) {
                            if (yDistance !== 0) {
                                if (yDistance > 0) {
                                    $ele.trigger('swipedown', [start, end]);
                                } else {
                                    $ele.trigger('swipeup', [start, end]);
                                }
                            }
                        }
                    }
                }
                return false;
            });
        },
        teardown: function () {
            var $this = $(this);
            $this.off('touchstart.cui');
            $this.off('touchmove.cui');
            $this.off('touchend.cui');

        }
    };
    $.event.special.swipeleft =
        $.event.special.swiperight =
            $.event.special.swipeup =
                $.event.special.swipedown =
                    $.event.special.moving =
                        $.event.special.pinchin =
                            $.event.special.pinchout = eventSetting
})(jQuery);