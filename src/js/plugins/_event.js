//Extend touch event
(function ($) {
    var _getDist = function (eventInfo) {
        var x = (eventInfo.touches[0].pageX - eventInfo.touches[1].pageX);
        var y = (eventInfo.touches[0].pageY - eventInfo.touches[1].pageY);
        return Math.sqrt(x * x + y * y);
    };
    var _getInfo = function (eventInfo) {
        var tmpEventInfo = Array.prototype.slice.call(eventInfo.touches);
        return {
            touches: tmpEventInfo.map(function (e) {
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
            $this.off('gesturestart').on('gesturestart', function (e) {
                e.preventDefault();
            });
            $this.off('touchstart.cui.gesture').on('touchstart.cui.gesture', function () {
                var $ele = $(this);
                $ele.data('_touchStart', null);
                $ele.data('_touchEnd', null);
                return true;
            });
            $this.off('touchmove.cui.gesture').on('touchmove.cui.gesture', $.throttle(function (e) {
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
                    return true;
                } else {
                    $ele.data('_touchEnd', event);
                }
                $ele.trigger('moving', [$ele.data('_touchStart'), event]);
                return true;
            }, 100));

            $this.off('touchend.cui.gesture').on('touchend.cui.gesture', function () {
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
                        if (Math.abs(xDistance) > Math.abs(yDistance) * 2) {
                            if (xDistance !== 0) {
                                if (xDistance > 0) {
                                    $ele.trigger('swipeleft', [start, end]);
                                } else {
                                    $ele.trigger('swiperight', [start, end]);
                                }
                            }
                        } else if (Math.abs(xDistance) * 2 < Math.abs(yDistance)) {
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
                return true;
            });
        },
        teardown: function () {
            var $this = $(this);
            $this.off('touchstart.cui.gesture');
            $this.off('touchmove.cui.gesture');
            $this.off('touchend.cui.gesture');

        }
    };
    $.event.special.swipeleft =
        $.event.special.swiperight =
            $.event.special.swipeup =
                $.event.special.swipedown =
                    $.event.special.moving =
                        $.event.special.pinchin =
                            $.event.special.pinchout = eventSetting;
})(jQuery);

//Extend transistion event
(function ($) {
    var eventSetting = {
        setup: function () {
            var $this = $(this);
            $this.off('webkitTransitionEnd.cui otransitionend.cui oTransitionEnd.cui msTransitionEnd.cui transitionend.cui')
            .on('webkitTransitionEnd.cui otransitionend.cui oTransitionEnd.cui msTransitionEnd.cui transitionend.cui', function () {
                $this.trigger('transitionend', []);
            });
        },
        teardown: function () {
            var $this = $(this);
            $this.off('webkitTransitionEnd.cui otransitionend.cui oTransitionEnd.cui msTransitionEnd.cui transitionend.cui');
        }
    }
    $.event.special.transitionend = eventSetting;
}(jQuery));

//draggable
(function ($) {
    var eventSetting = {
        setting: function () {
            var $this = $(this);
            var onDragStart = function () {
                if ($.isMobile()) {
                    $this.on('touchend.cui.draggable', onDragEnd);
                    $this.one('touchmove.cui.draggable', onDragMove);
                } else {
                    $this.on('mouseup.cui.draggable', onDragEnd);
                    $this.one('mousemove.cui.draggable', onDragMove);
                }
                $this.trigger('drag');
            };
            var onDragMove = function () {
                $this.one('touchmove.cui.draggable', function () {
                    $this.trigger('dragging');
                });
            }
            var onDragEnd = function () {
                $this.trigger('dragged');
            };
            if ($.isMobile()) {
                $this.on('touchstart.cui.draggable', onDragStart);
                $this.on('touchcancel.cui.draggable', onDragEnd);
            } else {
                $this.on('mousedown.cui.draggable', onDragStart);
                $this.on('dragstart.cui.draggable selectstart.cui.draggable', function () {
                    return false
                });
            }
        },
        teardown: function () {
            var $this = $(this);
            if ($.isMobile()) {
                $this.off('touchstart.cui.draggable');
                $this.off('touchcancel.cui.draggable');
            } else {
                this.$this.off('mousedown.cui.draggable');
                this.$this.off('dragstart.cui.draggable selectstart.cui.draggable', function () {
                    return false
                });
            }
            $this.off('touchstart.cui.draggable mousedown.cui.draggable');
            $this.off('touchcancel.cui.draggable mousedown.cui.draggable');

            $this.off('touchmove.cui.draggable mousemove.cui.draggable');
            $this.off('touchend.cui.draggable mouseup.cui.draggable');
        }
    };
    $.event.special.swipeleft =
        $.event.special.swiperight = eventSetting;
}(jQuery));