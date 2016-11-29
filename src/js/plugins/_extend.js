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
        throttle: function(fn, delay, scope) {
            delay || (delay = 250);
            var last,
                timer;
            return function() {
                var context = scope || this;

                var now = +new Date(),
                    args = arguments;
                if (last && now - last + delay < 0) {
                    // hold on to it
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        last = now;
                        fn.apply(context, args);
                    }, delay);
                } else {
                    last = now;
                    fn.apply(context, args);
                }
            };
        },
        debounce: function(fn, delay) {
            var timer = null;
            return function() {
                var context = this, args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    fn.apply(context, args);
                }, delay);
            };
        },
        isNotEmpty: function(str) {
            return !(str === '' || str === null || str === 'undefined');
        },
        isEmail: function(str) {
            var reg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
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
