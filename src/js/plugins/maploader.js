// 0: unload  1:loading  2: load
(function ($) {
    var mapLoaded = 0;
    window.CustomMarker = function (options) {
        var defaultOpt = {
            latlng: null,
            map: null,
            html: null,
            popData: null,
            popTmp: null,
            popHeight: null,
            onclick: null,
            popTheme: 'marker',
            zIndex: null
        };
        var opt = $.extend({}, defaultOpt, options);
        this.latlng = opt.latlng;
        this.html = opt.html;
        this.map = opt.map;
        this.popData = opt.popData;
        this.popTmp = opt.popTmp;
        this.popHeight = opt.popHeight;
        this.showPop = !!(opt.popData && opt.popTmp);
        this.onclick = opt.onclick;
        this.popTheme = opt.popTheme;
        this.zIndex = opt.zIndex;
        this.setMap(opt.map);
    };
    var initialCustomMarker = function () {
        window.CustomMarker.prototype = new window.google.maps.OverlayView();
        window.CustomMarker.prototype.poppanel = function (div) {
            var self = this;
            if(self.showPop) {
                var $pin = $(div);
                var html = $.renderHtml(self.popTmp, self.popData);
                var topOffset = $pin.outerHeight() * -1 - 10;
                var $content = $('<div class="pop-content "><div>' + html + '</div></div>');
                $content.click(function (e) {
                    e.stopPropagation();
                });
                var tippopover = $pin.tip({
                    content: $content,
                    placement: 'top',
                    trigger: 'click',
                    html: true,
                    once: true,
                    type: self.popTheme,
                    traget: null,
                    onload: function () {
                        $(document).trigger('dom.load');
                    },
                    container: self.map
                });
                self.reposition();
                setTimeout(function () {
                    tippopover.show();
                    window.google.maps.event.addListener(self.map, 'zoom_changed', function () {
                        tippopover.hide();
                    });
                    window.google.maps.event.addListener(self.map, 'dragstart', function () {
                        tippopover.hide();
                    });
                    $(document).trigger('dom.load');
                    if($pin.next('.popover')) {
                        $pin.next('.popover').css({
                            marginTop: topOffset,
                            zIndex: 999
                        });
                    }
                    $(window).one('click', function () {
                        tippopover.hide();
                    });
                }, 150);
            } else {
                self.onclick(div);
            }
        };
        window.CustomMarker.prototype.draw = function () {
            var self = this;
            var div = this.div;
            if(!div) {
                div = this.div = $(this.html)[0];
                var panes = this.getPanes();
                panes.overlayMouseTarget.appendChild(div);
                if(this.showPop || this.onclick) {
                    if(this.zIndex) {
                        $(div).css('zIndex', this.zIndex);
                    }
                    if($.isMobile()) {
                        window.google.maps.event.addDomListener($(div).children()[0], 'touchstart', function () {
                            if(self.onclick) {
                                self.onclick(div);
                            }
                            self.poppanel(div);
                        });
                    } else {
                        window.google.maps.event.addDomListener($(div).children()[0], 'click', function () {
                            if(self.onclick) {
                                self.onclick(div);
                            }
                            self.poppanel(div);
                        });
                    }
                }
            }
            var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
            if(point) {
                div.style.left = point.x + 'px';
                div.style.top = point.y + 'px';
            }
        };
        //if the pin current position out of screen, call the method to move map and make sure we can see pin in the screen
        window.CustomMarker.prototype.reposition = function () {
            var popover = this.div;
            var container = this.map.getDiv();
            if(popover && container) {
                var bounds = this.map.getBounds();
                if(!bounds) {
                    return;
                }
                var proj = this.getProjection();
                if(!proj) {
                    return;
                }
                var $popover = $(popover);
                var $container = $(container);
                var offset = $popover.position();
                var topRight = proj.fromLatLngToDivPixel(bounds.getNorthEast());
                var bottomLeft = proj.fromLatLngToDivPixel(bounds.getSouthWest());
                var top = offset.top - (this.popHeight || 0) - topRight.y;
                var left = offset.left - bottomLeft.x;
                var width = $popover.width();
                var height = $popover.height();
                var containerHeight = $container.height();
                var containerWidth = $container.width();
                var minTop = height * 2;
                var maxTop = containerHeight - height * 2;
                var minLeft = width * 2;
                var maxLeft = containerWidth - width * 2;
                var offsetX = 0;
                var offsetY = 0;
                if(top > maxTop) {
                    //move up +YYY
                    offsetY = maxTop - top;
                } else if(top < minTop) {
                    //move down -YYY
                    offsetY = top - minTop;
                }
                if(left > maxLeft) {
                    // move right +XXX
                    offsetX = left - maxLeft;
                } else if(left < minLeft) {
                    // move left -XXX
                    offsetX = left - minLeft;
                }
                if(offsetX !== 0 || offsetY !== 0) {
                    this.map.panBy(offsetX, offsetY);
                    this.draw();
                }
            }
        };
        window.CustomMarker.prototype.remove = function () {
            if(this.div) {
                this.div.parentNode.removeChild(this.div);
                this.div = null;
            }
        };
        window.CustomMarker.prototype.getPosition = function () {
            return this.latlng;
        };
        window.CustomMarker.prototype.refreshPop = function (popData, popTmp, onclick) {
            this.popData = popData;
            this.popTmp = popTmp;
            this.showPop = popData && popTmp;
            this.onclick = onclick;
        };
    };
    $.loadGMap = function () {
        return new Promise(function (resolve, reject) {
            try {
                //has load
                if(mapLoaded === 2) {
                    return resolve(window.google && window.google.map);
                } else {
                    $(document).one('gMapLoaded', function () {
                        resolve(window.google && window.google.map);
                    });
                    if(mapLoaded === 0) {
                        mapLoaded = 1;
                        //get ready to load
                        var config = {
                            callback: 'googlemapcallback'
                        };
                        var mapUrl = 'https://maps.googleapis.com/maps/api/js?' + window.context.googleMapKey;
                        $.each(config, function (key, value) {
                            mapUrl += ('&' + key + '=' + value);
                        });
                        return $.preload({
                            files: [mapUrl],
                            type: 'js',
                            callback: 'googlemapcallback',
                        }).then(function () {
                            initialCustomMarker();
                            mapLoaded = 2;
                            $(document).trigger('gMapLoaded');
                        });
                    }
                }
            } catch(e) {
                reject(e);
            }
        });
    };
})(jQuery);
