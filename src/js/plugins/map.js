// //custom marker
// var CustomMarker = function (option) {
//     this.lat = option.lat;
//     this.lng = option.lng;
//     this.map = option.map;
//     this.popData = option.popData;
//     this.popTmp = option.popTmp;
//     this.popHeight = option.popHeight;
//     this.onClick = option.onClick;
//     this.popTheme = option.popTheme || 'marker';
//     this.zIndex = option.zIndex;
//     this.setMap(this.map);
// };
// CustomMarker.prototype = new google.maps.OverlayView();
// CustomMarker.prototype.s = function (div) {
//     var self = this;
//     if (self.showPop) {
//         var $pin = $(div);
//         $pin.on('shown.bs.popover', function (e) {
//             $(document).trigger('dom.load');
//         });
//         var html = new EJS({
//             url: self.popTmp
//         }).render(self.popData);
//         var topOffset = $pin.outerHeight() * -1 - 10;
//         var $content = $('<div class="pop-content "><div>' + html + '</div></div>');
//         $content.click(function (e) {
//             e.stopPropagation();
//         });
//         var showInBottom = $(window).width() < 640 && self.popTheme === 'plain';
//         var tippopover = $pin.tippopover({
//             content: $content,
//             placement: 'top',
//             trigger: 'manual',
//             once: true,
//             theme: self.popTheme,
//             container: showInBottom ? '#dppMapview' : undefined
//         });
//         self.reposition();
//         setTimeout(function () {
//             tippopover.show();
//             if (self.onClick) {
//                 self.onClick(div);
//             }
//             google.maps.event.addListener(self.map, 'zoom_changed', function () {
//                 tippopover.hide();
//             });
//             google.maps.event.addListener(self.map, 'dragstart', function () {
//                 tippopover.hide();
//             });
//             $(document).trigger('dom.load');
//             if ($pin.next('.popover')) {
//                 $pin.next('.popover').css({
//                     marginTop: topOffset,
//                     zIndex: 999
//                 });
//             }
//             $(window).one('click', function () {
//                 tippopover.hide();
//             });
//         }, 150);
//     } else {
//         self.onClick(div);
//     }
// };
// CustomMarker.prototype.draw = function () {
//     var self = this;
//     var div = this.div;
//     if (!div) {
//         div = this.div = $(this.html)[0];
//         var panes = this.getPanes();
//         panes.overlayMouseTarget.appendChild(div);
//         if (this.showPop || this.onClick) {
//             if (this.zIndex) {
//                 $(div).css('zIndex', this.zIndex);
//             }
//             google.maps.event.addDomListener($(div).children()[0], 'click', function () {
//                 self.poppanel(div);
//             });
//         }
//     }
//     var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
//     if (point) {
//         div.style.left = point.x + 'px';
//         div.style.top = point.y + 'px';
//     }
// };

// //if the pin current position out of screen, call the method to move map and make sure we can see pin in the screen
// CustomMarker.prototype.reposition = function (foeceX, foeceY) {
//     var popover = this.div;
//     var container = this.map.getDiv();

//     if (popover && container) {
//         var bounds = this.map.getBounds();
//         if (!bounds) {
//             return;
//         }
//         var proj = this.getProjection();
//         if (!proj) {
//             return;
//         }
//         var $popover = $(popover);
//         var $container = $(container);
//         var offset = $popover.position();

//         var topRight = proj.fromLatLngToDivPixel(bounds.getNorthEast());
//         var bottomLeft = proj.fromLatLngToDivPixel(bounds.getSouthWest());
//         var top = offset.top - (this.popHeight || 0) - topRight.y;
//         var left = offset.left - bottomLeft.x;

//         var width = $popover.width();
//         var height = $popover.height();
//         var containerHeight = $container.height();
//         var containerWidth = $container.width();

//         var minTop = height * 2;
//         var maxTop = containerHeight - height * 2;
//         var minLeft = width * 2;
//         var maxLeft = containerWidth - width * 2;

//         var offsetX = 0;
//         var offsetY = 0;

//         if (top > maxTop) {
//             //move up +YYY
//             offsetY = maxTop - top;
//         } else if (top < minTop) {
//             //move down -YYY
//             offsetY = top - minTop;
//         }

//         if (left > maxLeft) {
//             // move right +XXX
//             offsetX = left - maxLeft;
//         } else if (left < minLeft) {
//             // move left -XXX
//             offsetX = left - minLeft;
//         }
//         if (offsetX !== 0 || offsetY !== 0) {
//             this.map.panBy(offsetX, offsetY);
//             this.draw();
//         }
//     }
// };
// CustomMarker.prototype.remove = function () {
//     if (this.div) {
//         this.div.parentNode.removeChild(this.div);
//         this.div = null;
//     }
// };
// CustomMarker.prototype.getPosition = function () {
//     return this.latlng;
// };
// CustomMarker.prototype.refreshPop = function (popData, popTmp, onClick) {
//     this.popData = popData;
//     this.popTmp = popTmp;
//     this.showPop = popData && popTmp;
//     this.onClick = onClick;
// };


// // 0: unload  1:loading  2: loaded
// var mapLoaded = 0;
// $.loadGMap = function (callback, option) {
//     if (mapLoaded === 2 || (window.google && window.google.map)) {
//         callback();
//         return;
//     }
//     $(document).one('gMapLoaded', callback);


//     if (mapLoaded !== 0) {
//         return;
//     }

//     var defaultOption = {
//         callback: 'googleMapLoadCallBack',
//         loadInfobox: false
//     };
//     var opt = $.extend({}, defaultOption, option);
//     var mapUrl = '//maps.googleapis.com/maps/api/js?libraries=geometry,places&' + context.googleMapKey + '&language=en-US';
//     Object.getOwnPropertyNames(opt).forEach(function (key) {
//         mapUrl += '&' + key + '=' + opt[key];
//     });

//     window.googleMapLoadCallBack = function () {

//         initialCustomMarker();
//         mapLoaded = 2;
//         $(document).trigger('gMapLoaded');
//     };
//     mapLoaded = 1;
//     Movoto.LoadJS(mapUrl, function () {});
// };


// (function ($) {
//     var mapConfig = {
//         name: 'map',
//         defaultOpt: {},
//         init: function (context) {
//             var opt = context.opt;
//             var $this = context.$element;
//             var $target = context.$target = $(opt.target);

//         },
//         exports: {
//             show: function () {

//             },
//             hide: function () {

//             }
//         },
//         setOptionsBefore: null,
//         setOptionsAfter: null,
//         initBefore: null,
//         initAfter: function (context) {
//             var $this = context.$element;
//             var $target = context.$target;
//             var opt = context.opt;
//             var exports = context.exports;

//         },
//         destroyBefore: function (context) {
//             var $this = context.$element;
//         }
//     };
//     $.CUI.plugin(mapConfig);
//     $(document).on('dom.load.map', function () {
//         $('[data-map]').each(function (index, item) {
//             var $this = $(item);
//             var data = $this.data();
//             $this.removeAttr('data-map');
//             $this.map(data);
//             $this.attr('data-map-load', '');
//             $this.attr('role', 'map');
//         });
//     });
// })(jQuery);