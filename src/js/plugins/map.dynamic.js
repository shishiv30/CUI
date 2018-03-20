(function ($) {
    var markManager = function (options) {
        this.markers = [];
        this.map = options.map;
        this.defaultOpt = $.extend({}, {
            map: options.map
        }, options.defaultOpt);
        this.create = options.create;
        this.destory = options.destory;
    };
    markManager.prototype.getAllMarkers = function () {
        return this.markers;
    };
    markManager.prototype.getMarkerWithIndexById = function (id) {
        for(var i = 0; i < this.markers.length; i++) {
            if(this.markers[i].id == id) {
                return {
                    element: this.markers[i],
                    index: i
                };
            }
        }
        return {
            element: null,
            index: -1
        };
    };
    markManager.prototype.getMarkerById = function (id) {
        return this.getMarkerWithIndexById(id)
            .element;
    };
    markManager.prototype.addMarker = function (option) {
        var opt = $.extend({}, this.defaultOpt, option);
        var marker =null;
        if(!opt.lat || !opt.lng) {
            return null;
        }
        if(!option.id) {
            option.id = $.guid++;
        }else {
            marker = this.getMarkerById(opt.id);
        }
        if(marker) {
            marker.setMap(this.map);
            return marker;
        }
        if(this.create) {
            marker = this.create.apply(this, [opt]);
        }
        if(marker) {
            if(opt.id) {
                marker.id = opt.id;
            }
            this.markers.push(marker);
            return marker;
        }
        return null;
    };
    markManager.prototype.addMarkers = function (options) {
        var self = this;
        if(options && options.length) {
            return options.map(function (option) {
                return self.addMarker(option);
            });
        }
        return [];
    };
    markManager.prototype.removeMarker = function (id) {
        var item = this.getMarkerWithIndexById(id);
        if(item.element) {
            if(this.destory) {
                id = this.destory.apply(this, [item.element]);
                this.markers.splice(item.index);
            }
        }
        return id;
    };
    markManager.prototype.removeMarkers = function (ids) {
        if(ids && ids.length) {
            return ids.map(function (id) {
                return this.removeMarker(id);
            });
        }
        return [];
    };
    var gmapConfig = {
        name: 'gmap',
        dependence: 'googlemap',
        defaultOpt: {
            lat: 0,
            lng: 0,
            zoom: 8,
            type: 0,
            streetview: false,
            inline: false,
            zoomable: true,
            draggable: true,
            scrollwheel: true,
            ondrag: null,
            ondraged: null,
            onzoom: null,
            onclick: null,
            onload: null,
            onresize: null,
            autoresize: false,
            clickableicons: true,
            disabledefaultui: false,
            streetviewcontrol: true,
            streetviewcontrolpos: 'BOTTOM_RIGHT',
            pancontrol: true,
            pancontrolpos: 'TOP_RIGHT',
            rotatecontrol: true,
            rotatecontrolpos: 'TOP_CENTER',
            zoomcontrol: true,
            zoomcontrolpos: 'BOTTOM_RIGHT',
            maptypecontrol: true,
            maptypecontrolpos: 'TOP_RIGHT',
            distancecontrol: true,
            distancecontrolpos: 'BOTTOM_LEFT',
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            var mapOptions = {
                disableDefaultUI: opt.disabledefaultui,
                gestureHandling: 'greedy',
                center: new window.google.maps.LatLng(opt.lat, opt.lng),
                mapTypeId: $.getMapTypeId(opt.type),
                zoom: opt.zoom,
                zoomable: opt.zoomable,
                scrollwheel: opt.scrollwheel,
                draggable: opt.draggable,
                clickableIcons: opt.clickableicons,
                streetViewControl: opt.streetviewcontrol,
                streetViewControlPos: opt.streetviewcontrolpos,
                panControl: opt.pancontrol,
                panControlPos: opt.pancontrolpos,
                rotateControl: opt.rotatecontrol,
                rotateControlPos: opt.rotatecontrolpos,
                zoomControl: opt.zoomcontrol,
                zoomControlPos: opt.zoomcontrolpos,
                mapTypeControl: opt.maptypecontrol,
                mapTypeControlPos: opt.maptypecontrolpos,
                distanceControl: opt.distancecontrol,
                distanceControlPos: opt.distancecontrolpos,
            };
            if(opt.inline) {
                mapOptions = $.extend(mapOptions, {
                    scrollwheel: false,
                    navigationControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    draggable: false
                });
            }
            var map = new window.google.maps.Map($this.get(0), mapOptions);
            context.map = map;
            var markers = new markManager({
                defaultOpt: {
                    draggable: false,
                    icon: 'icon-home',
                    onclick: null,
                    onmouseover: null,
                    onmouseout: null,
                    onhover: null,
                    html: null,
                    popTheme: null,
                    popData: null,
                    popTmp: null,
                    popHeight: 100,
                    zIndex: null,
                },
                map: context.map,
                create: function (markerOpt) {
                    var latlng = new window.google.maps.LatLng({
                        lat: markerOpt.lat,
                        lng: markerOpt.lng
                    });
                    var marker = new window.CustomMarker({
                        latlng: latlng,
                        map: markerOpt.map,
                        html: '<div class="map-marker"><a class="pin" ><i class="' + markerOpt.icon + '"></i></div></div>',
                        popData: markerOpt.popData,
                        popTmp: markerOpt.popTmp,
                        popHeight: markerOpt.popHeight,
                        onclick: markerOpt.onclick,
                        popTheme: markerOpt.popTheme,
                        zIndex: markerOpt.zIndex,
                    });
                    if(markerOpt.id) {
                        marker.id = markerOpt.id;
                    }
                    return marker;
                },
                destory: function (marker) {
                    $(marker)
                        .addClass('removeing');
                    $(document)
                        .one('mouseup', function () {
                            marker.setMap(null);
                        });
                }
            });
            context._setCenter = function (lat, lng) {
                var center = new window.google.maps.LatLng(lat, lng);
                return map.setCenter(center);
            };
            var panorama = null;
            context._showStreetView = function () {
                var streetViewLocation = new window.google.maps.LatLng(opt.lat, opt.lng);
                var sv = new window.google.maps.StreetViewService();
                sv.getPanoramaByLocation(streetViewLocation, 50, function (data, status) {
                    if(status == 'OK') {
                        panorama = map.getStreetView();
                        panorama.setPosition(streetViewLocation);
                        panorama.setVisible(true);
                    } else {
                        $(document)
                            .trigger('gmap.streetview.error');
                    }
                });
            };
            context._hideStreetView = function () {
                panorama.setVisible(false);
            };
            context._changeMaptype = function (id) {
                map.setMapTypeId($.getMapTypeId(id));
            };
            context._addMarker = function (option) {
                return markers.addMarker(option);
            };
            context._findItem = function (id) {
                for(var i = 0; i < markers.length; i++) {
                    if(markers[i].id == id) {
                        return {
                            element: markers[i],
                            index: i
                        };
                    }
                }
                return {
                    element: null,
                    index: -1
                };
            };
            context._getMarkerById = function (id) {
                return markers.getMarkerById(id);
            };
            context._setAllMap = function (map) {
                var markerList = markers.getAllMarkers();
                for(var i = 0; i < markerList.length; i++) {
                    markerList[i].setMap(map);
                }
            };
            context._hideMarkers = function () {
                context._setAllMap(null);
            };
            context._showMarkers = function () {
                context._setAllMap(map);
            };
            context._deleteMarker = function (id) {
                return markers.deleteMarker(id);
            };
            context._deleteMarkers = function (ids) {
                markers.deleteMarkers(ids);
            };
            context._getMarkers = function () {
                return markers;
            };
            context._getBounds = function () {
                return map.getBounds();
            };
            context._setZoom = function (level) {
                if($.isNumeric(level)) {
                    map.setZoom(level);
                }
            };
            context._fitBounds = function (latlngs) {
                var list = [];
                if(latlngs && latlngs.length) {
                    list = list.concat(latlngs.map(function (e) {
                        return {
                            lat: e.lat,
                            lng: e.lng
                        };
                    }));
                } else {
                    var markerList = markers.getAllMarkers();
                    list = markerList.map(function (e) {
                        return {
                            lat: e.lat || e.latlng.lat(),
                            lng: e.lng || e.latlng.lng()
                        };
                    });
                }
                if(list && list.length) {
                    var bounds = new window.google.maps.LatLngBounds();
                    for(var i = 0; i < list.length; i++) {
                        if(list[i].lat && list[i].lng) {
                            bounds.extend(new window.google.maps.LatLng(list[i].lat, list[i].lng));
                        }
                    }
                    map.fitBounds(bounds);
                }
            };
        },
        exports: {
            setCenter: function (lat, lng) {
                this._setCenter(lat, lng);
            },
            showStreetView: function () {
                this._showStreetView();
            },
            hideStreetView: function () {
                this._hideStreetView();
            },
            changeMaptype: function (id) {
                this._changeMaptype(id);
            },
            addMarker: function (option) {
                this._addMarker(option);
            },
            findItem: function (id) {
                this._findItem(id);
            },
            getMarkerById: function (id) {
                this._getMarkerById(id);
            },
            setAllMap: function (map) {
                this._setAllMap(map);
            },
            hideMarkers: function () {
                this._hideMarkers();
            },
            showMarkers: function () {
                this._showMarkers();
            },
            deleteMarker: function () {
                this._deleteMarker();
            },
            deleteMarkers: function () {
                this._deleteMarkers();
            },
            getMarkers: function () {
                this._getMarkers();
            },
            getBounds: function () {
                this._getBounds();
            },
            setZoom: function (level) {
                this._setZoom(level);
            },
            fitBounds: function (poiList) {
                this._fitBounds(poiList);
            },
        },
        setOptionsBefore: null,
        setOptionsAfter: null,
        initBefore: null,
        initAfter: function (context) {
            var map = context.map;
            var opt = context.opt;
            var exports = context.exports;
            window.google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
                //click event
                opt.onclick && $.CUI.trigger(opt.onclick, context);
                //drag event
                if(opt.draggable) {
                    if(opt.ondrag) {
                        window.google.maps.event.addListener(map, 'dragstart', function () {
                            $.CUI.trigger(opt.ondrag, context);
                        });
                    }
                    if(opt.ondraged) {
                        window.google.maps.event.addListener(map, 'dragend', function () {
                            $.CUI.trigger(opt.ondraged, context);
                        });
                    }
                }
                if(opt.zoomable && opt.onzoom) {
                    window.google.maps.event.addListener(map, 'zoom_changed', function () {
                        $.CUI.trigger(opt.onzoom, context);
                    });
                }
                if(opt.onload) {
                    $.CUI.trigger(opt.onload, context);
                }
            });
            if(opt.onresize) {
                window.google.maps.event.addListener(map, 'resize', function () {
                    $.CUI.trigger(opt.onresize, context);
                });
            }
            if(opt.autoresize) {
                window.google.maps.event.addDomListener(window, 'resize', function () {
                    context.reset();
                });
            }
            if(opt.streetview) {
                exports.showStreetView();
            }
        },
        destroyBefore: null
    };
    $.CUI.plugin(gmapConfig);
    $(document)
        .on('dom.load.gmap', function () {
            $('[data-gmap]')
                .each(function (index, item) {
                    var $this = $(item);
                    var data = $this.data();
                    $this.removeAttr('data-gmap');
                    $this.onscroll({
                        callback: function () {
                            $this.gmap(data);
                            $this.attr('data-gmap-load', '');
                        }
                    });
                });
        });
})(jQuery);
