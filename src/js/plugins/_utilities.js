(function ($) {
    var tmpdiv = null;
    $.extend({
        isIE: function () {
            return false;
        },
        renderHtml: function (template, data) {
            return Mustache.render(template, data);
        },
        scrollTo: function ($target, $scroll, offsettop, time) {
            if (offsettop && offsettop.indexOf('#') >= 0) {
                offsettop = $(offsettop).height() + $('#header').height();
            } else {
                offsettop = (offsettop !== undefined) ? offsettop : $('#header').height();
            }
            $scroll = $scroll || $('body, html');
            $scroll.animate({
                scrollTop: $target.offset().top - offsettop - 10
            }, time >= 0 ? time : 200);
        },
        htmlencode: function (s) {
            var div = document.createElement('div');
            div.appendChild(document.createTextNode(s));
            return div.innerHTML;
        },
        htmldecode: function (s) {
            var div = document.createElement('div');
            div.innerHTML = s;
            return div.innerText || div.textContent;
        },
        getTextWidth: function (text, fontsize) {
            var $body = $('body');
            fontsize = fontsize || $body.css('fontSize').replace(/[a-z]/g, '') * 1;
            if (!tmpdiv) {
                tmpdiv = $('<div></div>').css({
                    position: 'absolute',
                    visibility: 'hidden',
                    height: 'auto',
                    width: 'auto',
                    whiteSpace: 'nowrap'
                });
                $body.append(tmpdiv);
            }
            tmpdiv.css('fontSize', fontsize);
            tmpdiv.text(text);
            return tmpdiv.width();
        },
        _isMobile: null,
        isMobile: function () {
            if (this._isMobile !== null) {
                return this._isMobile;
            }
            return this._isMobile = !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        throttle: function (func, waitTime, options) {
            var context, args, result, wait = waitTime || 200;
            var timeout = null;
            var previous = 0;
            if (!options) options = {};
            var later = function () {
                previous = options.leading === false ? 0 : +new Date();
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            };
            return function () {
                var now = +new Date();
                if (!previous && options.leading === false) previous = now;
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0 || remaining > wait) {
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    previous = now;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        debounce: function (func, waitTime, immediate) {
            var timeout, args, context, timestamp, result, wait = waitTime || 200;
            var later = function () {
                var last = +new Date() - timestamp;

                if (last < wait && last >= 0) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                        if (!timeout) context = args = null;
                    }
                }
            };
            return function () {
                context = this;
                args = arguments;
                timestamp = +new Date();
                var callNow = immediate && !timeout;
                if (!timeout) timeout = setTimeout(later, wait);
                if (callNow) {
                    result = func.apply(context, args);
                    context = args = null;
                }
                return result;
            };
        },
        isNotEmpty: function (str) {
            return !(str === '' || str === null || str === 'undefined');
        },
        isEmail: function (str) {
            var reg = /^([\w-]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return reg.test(str);
        },
        isFloat: function (str) {
            var reg = /^([-]){0,1}([0-9]){1,}([.]){0,1}([0-9]){0,}$/;
            return reg.test(str);
        },
        isInt: function (str) {
            var reg = /^-?\d+$/;
            return reg.test(str);
        },
        isPhone: function (str) {
            var reg = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;
            return reg.test(str);
        },
        isZipCode: function (str) {
            var reg = /^([0-9]){5}$/;
            return reg.test(str);
        },
        isPrice: function (str) {
            var reg = /^(([$])?((([0-9]{1,3},)+([0-9]{3},)*[0-9]{3})|[0-9]+)(\.[0-9]+)?)$/;
            return reg.test(str);
        },
        sendMessage: function(message) {
            var dfd = $.Deferred();
            var messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = function(event) {
                if (event.data.error) {
                    dfd.reject(event.data.error);
                } else {
                    dfd.resolve(event.data);
                }
            };
            navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
            return dfd;
        }
    });
})(jQuery);
