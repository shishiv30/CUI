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
            // bind event once for all the gesture
            // if(!$this._gesture){
            //     $this._gesture =true;
            // }else{
            //     return;
            // }
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
                if(!$ele.data('_touchStart')) {
                    $ele.data('_touchStart', event);
                } else {
                    if($ele.data('_touchStart').touches.length == 1 && event.touches.length == 2) {
                        $ele.data('_touchStart', event);
                    }
                }
                if($ele.data('_touchStart').touches.length == 2 && event.touches.length == 1) {
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
                if(start && end) {
                    if(start.touches.length == 2) {
                        var startDistance = _getDist(start);
                        var endDistance = _getDist(end);
                        if(startDistance > endDistance) {
                            $ele.trigger('pinchin', [start, end]);
                        } else if(startDistance < endDistance) {
                            $ele.trigger('pinchout', [start, end]);
                        }
                    } else if(start.touches.length == 1) {
                        var xDistance = start.touches[0].pageX - end.touches[0].pageX;
                        var yDistance = start.touches[0].pageY - end.touches[0].pageY;
                        if(Math.abs(xDistance) > Math.abs(yDistance) * 2) {
                            if(xDistance !== 0) {
                                if(xDistance > 0) {
                                    $ele.trigger('swipeleft', [start, end]);
                                } else {
                                    $ele.trigger('swiperight', [start, end]);
                                }
                            }
                        } else if(Math.abs(xDistance) * 2 < Math.abs(yDistance)) {
                            if(yDistance !== 0) {
                                if(yDistance > 0) {
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
    $.event.special.swipeleft = $.event.special.swiperight = $.event.special.swipeup = $.event.special.swipedown = $.event.special.moving = $.event.special.pinchin = $.event.special.pinchout = eventSetting;
})(jQuery);
//draggable
(function ($) {
    var hasTouch = 'ontouchstart' in window,
        startEvent = hasTouch ? 'touchstart' : 'mousedown',
        moveEvent = hasTouch ? 'touchmove' : 'mousemove',
        endEvent = hasTouch ? 'touchend' : 'mouseup';
    var eventSetting = {
        setup: function () {
            var $this = $(this);
            // bind event once for all the drag
            if(!$this.data('_drag')) {
                $this.data('_drag', true);
            } else {
                return;
            }
            var _config = {
                start: null,
                end: null,
                trackDistance: null,
                swipeDistance: null,
                currPos: null,
                startTime: null,
                endTime: null,
                currTime: null,
                direction: null,
                duration: null
            };
            var _resetConfig = function () {
                _config.start = null;
                _config.end = null;
                _config.trackDistance = null;
                _config.swipeDistance = null;
                _config.currPos = null;
                _config.startTime = null;
                _config.endTime = null;
                _config.currTime = null;
                _config.direction = null;
                _config.duration = null;
            };
            var _trackSwipe = function () {
                if(_config.start && _config.currPos){
                    _config.direction = [
                        (_config.start[0] > _config.currPos[0]) ? 'left' : 'right',
                        (_config.start[1] > _config.currPos[1]) ? 'down' : 'up'
                    ];
                    _config.trackDistance = [
                        ('left' === _config.direction[0]) ? (_config.start[0] - _config.currPos[0]) : (_config.currPos[0] - _config.start[0]),
                        ('top' === _config.direction[1]) ? (_config.start[1] - _config.currPos[1]) : (_config.currPos[1] - _config.start[1])
                    ];
                    // Run the tracking callback.
                    $this.trigger('dragging', [
                        _config.direction,
                        _config.trackDistance,
                        _config.currPos,
                        _config.start,
                        parseInt(_config.currTime - _config.startTime)
                    ]);
                }
            };
            var _confirmSwipe = function () {
                // Set up the direction property.
                if(_config.start && _config.currPos){
                    _config.direction = [
                        (_config.start[0] > _config.currPos[0]) ? 'left' : 'right',
                        (_config.start[1] > _config.currPos[1]) ? 'down' : 'up'
                    ];
                    // Set up the duration property.
                    _config.duration = parseInt(_config.endTime - _config.startTime);
                    // Work out the distance based on the direction of the swipe.
                    _config.swipeDistance = [
                        ('left' === _config.direction[0]) ? (_config.start[0] - _config.end[0]) : (_config.end[0] - _config.start[0]),
                        ('top' === _config.direction[1]) ? (_config.start[1] - _config.end[1]) : (_config.end[1] - _config.start[1])
                    ];
                    // This is where we determine whether it was a swipe or not.
                    $this.trigger('dragged', [
                        _config.direction,
                        _config.swipeDistance,
                        _config.duration
                    ]);
                    // Reset the variables.
                    _resetConfig();
                }
            };
            $this.on(startEvent + '.cui.draggable', function (t) {
                var e = t.originalEvent;
                if((e.targetTouches && 1 === e.targetTouches.length) || !hasTouch) {
                    var eventObj = hasTouch ? e.targetTouches[0] : e;
                    _config.startTime = Date.now();
                    _config.start = [parseInt(eventObj.pageX), parseInt(eventObj.pageY)];
                    $this.trigger('drag');
                }
            });
            $this.on(moveEvent + '.cui.draggable', function (t) {
                var e = t.originalEvent;
                if(_config.start && ((e.targetTouches && 1 === e.targetTouches.length) || !hasTouch)) {
                    var eventObj = hasTouch ? e.targetTouches[0] : e;
                    _config.currTime = Date.now();
                    _config.currPos = [parseInt(eventObj.pageX), parseInt(eventObj.pageY)];
                    _trackSwipe();
                }
                e.preventDefault();
            });
            $this.on(endEvent + '.cui.draggable mouseleave.cui.draggable', function (t) {
                var e = t.originalEvent;
                var eventObj = hasTouch ? e.changedTouches[0] : e;
                // Set the end event related properties.
                _config.endTime = Date.now();
                _config.end = [parseInt(eventObj.pageX), parseInt(eventObj.pageY)];
                // Run the confirm swipe method.
                _confirmSwipe();
                // e.preventDefault();
            });
        },
        teardown: function () {
            var $this = $(this);
            $this.off(startEvent + '.cui.draggable');
            $this.off(moveEvent + '.cui.draggable');
            $this.off(endEvent + '.cui.draggable');
        }
    };
    $.event.special.drag = $.event.special.dragging = $.event.special.dragged = $.event.special.dragout = eventSetting;
}(jQuery));
