(function ($) {
    var gmapConfig = {
        name: 'gmap',
        dependence: 'googlemap',
        defaultOpt: {
            lat: 0,
            lng: 0,
            zoom: 8,
            type: 0,
            streetview: false,
            inline:false,
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
            var markers = [];
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
            if(opt.inline){
                mapOptions =$.extend(mapOptions,{
                    scrollwheel: false,
                    navigationControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    draggable: false
                });
            }
            var map = new window.google.maps.Map($this.get(0), mapOptions);
            context.map = map;
            context.markers = markers;
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
                        $(document).trigger('gmap.streetview.error');
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
                var defaultOption = {
                    lat: 0,
                    lng: 0,
                    draggable: false,
                    icontype: 0,
                    onclick: null,
                    onmouseover: null,
                    onmouseout: null,
                    onhover: null,
                    id: $.guid++,
                    html: null,
                    popTheme: null,
                    popData: null,
                    popTmp: null,
                    popHeight: 100,
                    zIndex: null,
                    isNeedMobileCard: null
                };
                var opt = $.extend({}, defaultOption, option);
                if(!opt.lat || !opt.lng) {
                    return;
                }
                var addedMark = context._getMarkerById(opt.id);
                if(addedMark) {
                    addedMark.setMap(map);
                    return addedMark;
                }
                var marker = null;
                if(opt.html) {
                    var latlng = new window.google.maps.LatLng({
                        lat: opt.lat,
                        lng: opt.lng
                    });
                    if(opt.html === true) {
                        var icon = $.getIcon(opt.icontype);
                        if(opt.icontype === 0) {
                            opt.html = '<div class="map-marker"><a href="javascript:;" class="img-pin"><img alt="map image" src="' + icon.url + '"  style="height:48px"></a></div>';
                        } else {
                            opt.html = '<div class="map-marker"><a href="javascript:;" class="img-pin"><img alt="map image" src="' + icon.url + '"></a></div>';
                        }
                        if(icon.zIndex) {
                            opt.zIndex = icon.zIndex;
                        }
                    }
                    marker = new window.CustomMarker({
                        latlng: latlng,
                        map: map,
                        html: opt.html,
                        popData: opt.popData,
                        popTmp: opt.popTmp,
                        popHeight: opt.popHeight,
                        onclick: opt.onclick,
                        popTheme: opt.popTheme,
                        zIndex: opt.zIndex,
                        isNeedMobileCard: opt.isNeedMobileCard,
                    });
                } else {
                    marker = new window.google.maps.Marker({
                        map: map,
                        icon: $.getIcon(opt.icontype),
                        lat: opt.lat,
                        lng: opt.lng,
                        size: new window.google.maps.Size({
                            height: 25,
                            width: 17
                        }),
                        draggable: false,
                        position: new window.google.maps.LatLng(opt.lat, opt.lng)
                    });
                    if(opt.onclick) {
                        window.google.maps.event.addListener(marker, 'click', function (e) {
                            //return false, will stop to pop 'click' event
                            return opt.onclick(context.map, marker, e);
                        });
                    }
                    $($.isMobile);
                    if(opt.onmouseover) {
                        marker.addListener('mouseover', function (e) {
                            return opt.onmouseover(context.map, marker, e);
                        }, true);
                    }
                    if(opt.onmouseout) {
                        marker.addListener('mouseout', function (e) {
                            return opt.onmouseout(context.map, marker, e);
                        }, true);
                    }
                }
                if(opt.id) {
                    marker.id = opt.id;
                }
                markers.push(marker);
                return marker;
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
                return context._findItem(id).element;
            };
            context._setAllMap = function (map) {
                for(var i = 0; i < markers.length; i++) {
                    markers[i].setMap(map);
                }
            };
            context._hideMarkers = function () {
                context._setAllMap(null);
            };
            context._showMarkers = function () {
                context._setAllMap(map);
            };
            context._deleteMarker = function (id) {
                var item = context._findItem(id);
                if(item.element) {
                    item.element.setMap(null);
                    if(item.index > -1) {
                        markers.splice(item.index, 1);
                    }
                }
            };
            context._deleteMarkers = function () {
                context._hideMarkers();
                markers = [];
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
            context._fitBounds = function (poiList) {
                var list = [];
                if(markers && markers.length) {
                    list = markers.map(function (e) {
                        return {
                            lat: e.lat || e.latlng.lat(),
                            lng: e.lng || e.latlng.lng()
                        };
                    });
                }
                if(poiList && poiList.length > 0) {
                    list = list.concat(poiList.map(function (e) {
                        return {
                            lat: e.lat,
                            lng: e.lng
                        };
                    }));
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
            if(opt.streetView !== false) {
                context._showStreetView();
            }
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
        },
        destroyBefore: null
    };
    $.CUI.plugin(gmapConfig);
    $(document).on('dom.load.gmap', function () {
        $('[data-gmap]').each(function (index, item) {
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
