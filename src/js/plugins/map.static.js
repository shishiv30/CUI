(function ($) {
    var gsmapConfig = {
        name: 'gsmap',
        defaultOpt: {
            lat: 0,
            lng: 0,
            address: null,
            zoom: 8,
            type: 'terrain',
            icon: '',
            markers: [],
            width: null,
            height: null,
            lazyload: true,
            autoresize: true,
            onload: null,
            polylinedata: null,
            fillcolor: null,
            switchmaptype: 'terrain',
            removedTarget: null
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            var insertMap = function (mapUrl) {
                if (!mapUrl) {
                    return;
                }
                mapUrl = 'https://maps.googleapis.com' + mapUrl;
                if (opt.lazyload) {
                    $this.attr('data-img', mapUrl);
                    $.loadImage();
                } else {
                    $this.is('img') ?
                        $this.attr('src', mapUrl).data('img', mapUrl) :
                        $this.css('background-image', 'url(' + mapUrl + ')');
                }
            };
            var setGSMapParams = function () {
                var mapUrl;
                mapUrl = '/maps/api/staticmap?';
                if (opt.address) {
                    mapUrl += 'center=' + encodeURIComponent(opt.address);
                } else if (opt.lat && opt.lng) {
                    mapUrl += 'center=' + opt.lat + ',' + opt.lng;
                }
                mapUrl += '&maptype=' + opt.type;
                if (opt.zoom && !opt.polylinedata && opt.zoom != -1) {
                    mapUrl += '&zoom=' + opt.zoom;
                }
                if (opt.markers && opt.markers.length) {
                    $.each(opt.markers, function (index, item) {
                        var iconStr = '';
                        if (opt.icon && opt.icon.length) {
                            var realUrl = $.getIconUrl(opt.icon[Math.min(index, (opt.icon.length - 1))]);
                            iconStr = 'icon:' + encodeURIComponent(realUrl + '|');
                        }
                        mapUrl += '&markers=' + iconStr + encodeURIComponent(item);
                    });
                }
                if (opt.fillcolor) {
                    if (opt.polylinedata) {
                        mapUrl += encodeURIComponent('&path=fillcolor:' + opt.fillcolor + '|color:0xFFFFFF00|enc:' + opt.polylinedata);
                    } else {
                        mapUrl += '&path=fillcolor:' + opt.fillcolor;
                    }
                }
                var _width = opt.width || $this.width();
                var _height = opt.height || $this.height();
                mapUrl += '&size=' + _width + 'x' + _height;
                mapUrl += '&' + window.context.googleMapKey;
                return mapUrl;
            };
            var initialGStaticStreetView = function (hasSteetView) {
                if (hasSteetView) {
                    var streetviewUrl = '/maps/api/streetview?location=';
                    var _width = opt.width || $this.width();
                    var _height = opt.height || $this.height();
                    if (opt.address) {
                        streetviewUrl += encodeURIComponent(opt.address);
                    } else if (opt.lat && opt.lng) {
                        streetviewUrl += opt.lat + ',' + opt.lng;
                    }
                    streetviewUrl += '&size=' + _width + 'x' + _height;
                    streetviewUrl += '&' + window.context.googleMapKey;
                    insertMap(streetviewUrl);
                } else {
                    if (opt.onError) {
                        if ($.isFunction(opt.onError)) {
                            opt.onError($this);
                        } else {
                            $(document).trigger(opt.onError, [$this]);
                        }
                    }

                    if (opt.removedTarget) {
                        var $removedTarget = $(opt.removedTarget);
                        $removedTarget.remove();
                        $(document).trigger('dom.resize');
                    }
                    if (opt.switchmaptype) {
                        opt.type = opt.switchmaptype;
                        insertMap(setGSMapParams());
                    }
                }
            };
            context._reload = function () {
                if (opt.type === 'streetview') {
                    $.hasStreetView({
                        address: opt.address,
                        lat: opt.lat,
                        lng: opt.lng,
                        callback: initialGStaticStreetView
                    });
                } else {
                    var url = setGSMapParams();
                    insertMap(url);
                }
                opt.onload && $.CUI.trigger(opt.onload);
            };
            context._reload();
        },
        exports: {
            reload: function () {
                this._reload();
            }
        },
        setOptionsBefore: function (context, options) {
            options.icon = options.icon ? options.icon.split('|') : null;
            options.markers = options.markers ? options.markers.split('|') : [];
        },
        setOptionsAfter: null,
        initBefore: null,
        initAfter: function (context) {
            var opt = context.opt;
            var exports = context.exports;
            if (opt.autoresize) {
                $(document).on('dom.resize', function () {
                    exports.reload();
                });
            }
        },
        destroyBefore: null
    };
    $.CUI.plugin(gsmapConfig);
    $(document).on('dom.load.gsmap', function () {
        $('[data-gsmap]').each(function (index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.removeAttr('data-gsmap');
            $this.gsmap(data);
            $this.attr('data-gsmap-load', '');
        });
    });
})(jQuery);
