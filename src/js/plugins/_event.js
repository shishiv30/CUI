//Extend touch event
(function ($) {
    var _getDist = function (eventInfo) {
        var x = (eventInfo.touches[0].pageX - eventInfo.touches[1].pageX);
        var y = (eventInfo.touches[0].pageY - eventInfo.touches[1].pageY);
        return Math.sqrt(x * x + y * y);
    };

    var eventSetting = {
        setup: function () {
            var $this = $(this);
            $this.off("touchstart.cui").on("touchstart.cui", function (e) {
                $this.data('_touchStart', null);
                $this.data('_touchEnd', null);
                return false;
            });
            $this.off("touchmove.cui").on('touchmove.cui', $.throttle(function (e) {
                var event = e.originalEvent;
                if (!$this.data('_touchStart')) {
                    $this.data('_touchStart', event);
                } else {
                    if ($this.data('_touchStart').touches.length == 1 && event.touches.length == 2) {
                        $this.data('_touchStart', event);
                    }
                }
                if ($this.data('_touchStart').touches.length == 2 && event.touches.length == 1) {
                    return;
                } else {
                    $this.data('_touchEnd', event);
                }
                $this.trigger('moving', [$this.data('_touchStart'), event]);
                return false;
            }, 50));

            $this.off("touchend.cui").on("touchend.cui", function (e) {
                var start = $this.data('_touchStart');
                var end = $this.data('_touchEnd');
                if (start && end) {
                    if (start.touches.length == 2) {
                        var startDistance = _getDist(start);
                        var endDistance = _getDist(end);
                        if (startDistance > endDistance) {
                            $this.trigger('pinchin', [start, end]);
                        } else if ($this.data('_touchEvent') < dist) {
                            $this.trigger('pinchout', [start, end]);
                        }
                    } else if (start.touches.length == 1) {
                        var xDistance = start.touches[0].pageX - end.touches[0].pageX;
                        var yDistance = start.touches[0].pageY - end.touches[0].pageY;
                        if (Math.abs(xDistance) > Math.abs(yDistance)) {
                            if (xDistance !== 0) {
                                if (xDistance > 0) {
                                    $this.trigger('swipeleft', [start, end]);
                                } else {
                                    $this.trigger('swiperight', [start, end]);
                                }
                            }
                        } else {
                            if (yDistance !== 0) {
                                if (yDistance > 0) {
                                    $this.trigger('swipedown', [start, end]);
                                } else {
                                    $this.trigger('swipeup', [start, end]);
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