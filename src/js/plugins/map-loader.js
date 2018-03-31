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
                var $content = $('<div class="pop-content"><div>' + html + '</div></div>');
                var tippopover = $pin.find('.pin').tip({
                    content: $content,
                    placement: 'top',
                    trigger: 'click',
                    html: true,
                    once: true,
                    type: self.popTheme,
                    onload: function () {
                        // $(document).trigger('dom.load');
                    },

                });
                setTimeout(function () {
                    tippopover.show();
                    window.google.maps.event.addListener(self.map, 'zoom_changed', function () {
                        tippopover.hide();
                    });
                    window.google.maps.event.addListener(self.map, 'dragstart', function () {
                        tippopover.hide();
                    });
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
        var dfd = $.Deferred();
        //has load
        if(mapLoaded === 2) {
            dfd.resolve(window.google && window.google.map);
        } else {
            $(document).one('gMapLoaded', function () {
                dfd.resolve(window.google && window.google.map);
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
                $.preload({
                    files: [mapUrl],
                    type: 'js',
                    callback: 'googlemapcallback',
                }).then(function () {
                    initialCustomMarker();
                    mapLoaded = 2;
                    dfd.resolve(window.google && window.google.map);
                    $(document).trigger('gMapLoaded');
                });
            }
        }
        return dfd;
    };
})(jQuery);
