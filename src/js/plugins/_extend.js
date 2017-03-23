(function($) {
    var tmpdiv = null;
    $.extend({
        htmlencode: function(s) {
            var div = document.createElement('div');
            div.appendChild(document.createTextNode(s));
            return div.innerHTML;
        },
        htmldecode: function(s) {
            var div = document.createElement('div');
            div.innerHTML = s;
            return div.innerText || div.textContent;
        },
        getTextWidth: function(text, fontsize) {
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
        insertCSS: function(selector, rules, contxt) {
            var context = contxt || document,
                stylesheet;

            if (typeof context.styleSheets == 'object') {
                if (context.styleSheets.length) {
                    stylesheet = context.styleSheets[context.styleSheets.length - 1];
                }
                if (context.styleSheets.length) {
                    if (context.createStyleSheet) {
                        stylesheet = context.createStyleSheet();
                    } else {
                        context.getElementsByTagName('head')[0].appendChild(context.createElement('style'));
                        stylesheet = context.styleSheets[context.styleSheets.length - 1];
                    }
                }
                if (stylesheet.addRule) {
                    for (var i = 0; i < selector.length; ++i) {
                        stylesheet.addRule(selector[i], rules);
                    }
                } else {
                    stylesheet.insertRule(selector.join(',') + '{' + rules + '}', stylesheet.cssRules.length);
                }
            }
        },
        isMobile: function() {
            return !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        throttle: function(func, wait, options) {
            var context, args, result, wait = wait || 200;
            var timeout = null;
            var previous = 0;
            if (!options) options = {};
            var later = function() {
                previous = options.leading === false ? 0 : +new Date();
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            };
            return function() {
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
        debounce: function(func, wait, immediate) {
            var timeout, args, context, timestamp, result, wait = wait || 200;
            var later = function() {
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
            return function() {
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
        isNotEmpty: function(str) {
            return !(str === '' || str === null || str === 'undefined');
        },
        isEmail: function(str) {
            var reg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return reg.test(str);
        },
        isFloat: function(str) {
            var reg = /^([-]){0,1}([0-9]){1,}([.]){0,1}([0-9]){0,}$/;
            return reg.test(str);
        },
        isInt: function(str) {
            var reg = /^-?\d+$/;
            return reg.test(str);
        },
        isPhone: function(str) {
            var reg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/im;
            return reg.test(str);
        },
        isZipCode: function(str) {
            var reg = /^([0-9]){5}$/;
            return reg.test(str);
        },
        isPrice: function(str) {
            var reg = /^(([$])?((([0-9]{1,3},)+([0-9]{3},)*[0-9]{3})|[0-9]+)(\.[0-9]+)?)$/;
            return reg.test(str);
        }
    });

})(jQuery);
