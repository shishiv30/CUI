(function ($) {
    $.iconType = {
        home: 0,
        heart: 2,
        poiSchool: 1,
        //poi pins
        poiBank: 116,
        poiWorship: 115,
        poiRecreation: 113,
        poiTransportHub: 111,
        poiGas: 110,
        poiTexi: 109,
        poiTransportation: 108,
        poiGrocery: 106,
        poiCafe: 104,
        poiRestaurant: 103,
        poiBar: 102,
        poiShopping: 117
    };
    $.getIconUrl = function (type) {
        var fileType = !$.isIE() ? 'svg' : 'png';
        var url = '';
        switch (type * 1) {
        case $.iconType.home:
            url = 'img/pin/homeicon.' + fileType;
            break;
        case $.iconType.school:
            url = 'img/pin/schoolicon.' + fileType;
            break;
        case $.iconType.schoolred:
            url = 'img/pin/red_school.png';
            break;
        case $.iconType.heart:
            url = 'img/pin/favorite.png';
            break;
        case $.iconType.condored:
            url = 'img/pin/red_condo.png';
            break;
        case $.iconType.condoblue:
            url = 'img/pin/blue_condo.png';
            break;
        case $.iconType.condogreen:
            url = 'img/pin/green_condo.png';
            break;
        case $.iconType.condogray:
            url = 'img/pin/black_condo.png';
            break;
        case $.iconType.condoyellow:
            url = 'img/pin/yellow_condo.png';
            break;
        case $.iconType.singlered:
            url = 'img/pin/red_single.png';
            break;
        case $.iconType.singleblue:
            url = 'img/pin/blue_single.png';
            break;
        case $.iconType.singlegreen:
            url = 'img/pin/green_single.png';
            break;
        case $.iconType.singlegray:
            url = 'img/pin/black_single.png';
            break;
        case $.iconType.singleyellow:
            url = 'img/pin/yellow_single.png';
            break;
        case $.iconType.poiBank:
            url = 'img/pin/poi-bank.' + fileType;
            break;
        case $.iconType.poiWorship:
            url = 'img/pin/poi-worship.' + fileType;
            break;
        case $.iconType.poiRecreation:
            url = 'img/pin/poi-recreation.' + fileType;
            break;
        case $.iconType.poiTransportHub:
            url = 'img/pin/poi-train.' + fileType;
            break;
        case $.iconType.poiGas:
            url = 'img/pin/poi-gas.' + fileType;
            break;
        case $.iconType.poiTexi:
            url = 'img/pin/poi-taxi.' + fileType;
            break;
        case $.iconType.poiTransportation:
            url = 'img/pin/poi-transportation.' + fileType;
            break;
        case $.iconType.poiGrocery:
            url = 'img/pin/poi-grocery.' + fileType;
            break;
        case $.iconType.poiCafe:
            url = 'img/pin/poi-cafe.' + fileType;
            break;
        case $.iconType.poiRestaurant:
            url = 'img/pin/poi-restaurant.' + fileType;
            break;
        case $.iconType.poiBar:
            url = 'img/pin/poi-bar.' + fileType;
            break;
        case $.iconType.poiShopping:
            url = 'img/pin/poi-shopping.' + fileType;
            break;
        case $.iconType.comericialorange:
            url = 'img/pin/property_orange_commercial.' + fileType;
            break;
        case $.iconType.condoorange:
            url = 'img/pin/property_orange_condo.' + fileType;
            break;
        case $.iconType.lotlandorange:
            url = 'img/pin/property_orange_lot_land.' + fileType;
            break;
        case $.iconType.mobilehomeorange:
            url = 'img/pin/property_orange_mobile_home.' + fileType;
            break;
        case $.iconType.otherorange:
            url = 'img/pin/property_orange_other.' + fileType;
            break;
        case $.iconType.singleorange:
            url = 'img/pin/property_orange_single_family.' + fileType;
            break;
        case $.iconType.multifamilyorange:
            url = 'img/pin/property_orange_multi_family.' + fileType;
            break;
        default:
            url = type;
        }
        return window.context.url + url;
    };
    $.getIcon = function (type) {
        var icon = {
            url: window.context.url
        };
        switch (type) {
        case $.iconType.home:
            icon.size = new window.google.maps.Size(32, 48);
            icon.origin = new window.google.maps.Point(0, 0);
            icon.anchor = new window.google.maps.Point(18, 48);
            break;
        case $.iconType.school:
        case $.iconType.poiBank:
        case $.iconType.poiWorship:
        case $.iconType.poiRecreation:
        case $.iconType.poiTransportHub:
        case $.iconType.poiGas:
        case $.iconType.poiTexi:
        case $.iconType.poiTransportation:
        case $.iconType.poiGrocery:
        case $.iconType.poiCafe:
        case $.iconType.poiRestaurant:
        case $.iconType.poiBar:
        case $.iconType.poiShopping:
            icon.size = new window.google.maps.Size(36, 48);
            icon.origin = new window.google.maps.Point(0, 0);
            icon.anchor = new window.google.maps.Point(18, 48);
            break;
        case $.iconType.comericialorange:
        case $.iconType.condoorange:
        case $.iconType.lotlandorange:
        case $.iconType.mobilehomeorange:
        case $.iconType.otherorange:
        case $.iconType.singleorange:
        case $.iconType.multifamilyorange:
            icon.size = new window.google.maps.Size(48, 64);
            icon.origin = new window.google.maps.Point(0, 0);
            icon.anchor = new window.google.maps.Point(24, 64);
            break;
        default:
            icon.size = new window.google.maps.Size(30, 44);
            icon.origin = new window.google.maps.Point(0, 0);
            icon.anchor = new window.google.maps.Point(14, 44);
            break;
        }

        icon.url += $.getIconUrl(type, !$.isIE());
        if (type === $.iconType.home) {
            icon.zIndex = 998; //cannot large than 999, the pop panel cannot cover the pin
        }
        return icon;
    };
    $.getMapTypeId = function (type) {
        var mapTypeId;
        switch (type * 1) {
        case 0:
            mapTypeId = window.google.maps.MapTypeId.ROADMAP;
            break;
        case 1:
            mapTypeId = window.google.maps.MapTypeId.SATELLITE;
            break;
        case 2:
            mapTypeId = window.google.maps.MapTypeId.HYBRID;
            break;
        case 3:
            mapTypeId = window.google.maps.MapTypeId.TERRAIN;
            break;
        default:
            mapTypeId = window.google.maps.MapTypeId.ROADMAP;
            break;
        }
        return mapTypeId;
    };
    $.streetViewCheckList = {};
    $.hasStreetView = function (opt) {
        var key = null;
        if (opt.address) {
            key = encodeURIComponent(opt.address);
        } else if (opt.lat && opt.lng) {
            key = opt.lat + ',' + opt.lng;
        } else {
            return opt.callback(false);
        }
        if ($.streetViewCheckList[key] !== undefined) {
            if ($.streetViewCheckList[key] !== 'loading') {
                return opt.callback(($.streetViewCheckList[key]));
            }
            $(document).one('hasStreetView.' + key, function (e, hasStreetView) {
                opt.callback(hasStreetView);
            });
        } else {
            $.streetViewCheckList[key] = 'loading';
            var metaDataUrl = 'https://maps.googleapis.com/maps/api/streetview/metadata?location=' + key + '&' + window.context.googleMapKey;
            var data = {
                url: metaDataUrl
            };
            $.post(data.url, function (res) {
                $.streetViewCheckList[key] = res && res.status === 'OK';
                opt.callback($.streetViewCheckList[key]);
                $(document).trigger('hasStreetView.' + key, [$.streetViewCheckList[key]]);
            });
        }
    };
})(jQuery);
