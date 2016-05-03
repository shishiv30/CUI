(function() {
    'use strict';

    var getPosition = function(alert, element, relativePosition) {
        var alertWidth = alert.outerWidth();
        var alertHeight = alert.outerHeight();
        if (!element) {
            return {
                top: '50%',
                left: '50%',
                marginLeft: ('-' + alertWidth / 2 + 'px'),
                marginTop: ('-' + alertHeight / 2 + 'px'),
            };
        }
        var offset = $(element).offset();
        var height = $(element).outerHeight();
        var width = $(element).outerWidth();
        var pos = {
            top: relativePosition === 'bottom' ? (offset.top + height + 20) + 'px' : (offset.top - alertHeight - 20) + 'px',
            left: alertHeight <= width ? (offset.left + (width / 2 - alertWidth / 2)) + 'px' : (offset.left - (alertWidth / 2 - width / 2)) + 'px'
        };
        return pos;
    };

    $.alert = function(options) {
        var defaultOpt = {
            text: '',
            target: null,
            relative: '',
            relativePosition: 'bottom',
            timeout: 3000,
            top: 0,
            style: 'error',
            autoClose: true,
            width: 'auto'
        };
        var height = 0;
        var width = 0;
        var opt = $.extend({}, defaultOpt, options);
        var target = opt.target ? $(opt.target) : $('body');
        var alert = $('<div class="alert ' + opt.style + '" style="width:' + opt.witdh + '">' + opt.text + '</div>');
        target.after(alert);

        var pos = getPosition(alert, opt.relative, opt.relativePosition);

        if (opt.target) {
            height = target.height();
            width = target.width();
            alert.css({
                position: 'absolute',
                top: opt.top + height,
                left: 0,
                right: 0
            });
        } else {
            alert.css($.extend({
                position: 'fixed'
            }, pos));
        }
        alert.css('opacity', '1');
        if (opt.autoClose === true) {
            setTimeout(function() {
                alert.remove();
            }, opt.timeout);
        }
        return alert;
    };

    $.fn.alert = function(options) {
        var $this = $(this);
        var defaultOpt = {
            text: '',
            title: '<i class="icon-warning"></i> Error',
            html: true,
            theme: "error",
            trigger: "manual",
            placement: "bottom",
            showFirst: true,
            forceDestroy: true,
            onHide: null,
            onShow: null
        };
        var opt = $.extend(defaultOpt, options);
        var tmp = '<div class="popover ' + opt.theme + '" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>';

        $this.popover({
            title: opt.title,
            content: opt.text || opt.content,
            html: true,
            template: tmp,
            trigger: opt.trigger,
            placement: opt.placement
        });
        opt.forceDestroy && $this.on('shown.bs.popover', function() {
            if (opt.onShow) {
                if ($.isFunction(opt.onShow)) {
                    opt.onShow($this);
                } else {
                    $(document).trigger(opt.onShow, [$this]);
                }
            }
            $(document).one('click', function() {
                $this.popover('destroy');
            });
        })
        if (opt.onHide) {
            $this.on('hidden.bs.popover', function() {
                if ($.isFunction(opt.onHide)) {
                    opt.onHide($this);
                } else {
                    $(document).trigger(opt.onHide, [$this]);
                }
            });
        }

        opt.showFirst && $this.popover('show');
    }
})(jQuery);

//collapse
(function($) {
    $.fn.collapse = function(options) {
        //appear & expand
        var defaultOpt = {
            type: "appear",
            showText: null,
            hideText: null,
            autoClose: false,
            offsetTop: null,
        };
        var opt = $.extend({}, defaultOpt, options);
        var $this = $(this);
        var $target = $(opt.target);

        var hide = function() {
            var height
            if ($target.offset().top < $this.offset().top) {

                height = $target.height();
            }

            if (height) {
                height = $(document).scrollTop() - height;
                $(document).scrollTop(height);
            }

            $this.removeClass("shown");
            $target.removeClass("collapse-appear");
            $target.hide();
        };
        var show = function() {
            $this.addClass("shown");
            $target.addClass("collapse-appear");
            $target.show();
            if (opt.autoClose) {
                $(document).off("mouseup").one("mouseup", function(e) {
                    hide();
                });
            }
        };
        if (opt.autoClose) {
            $this.mouseup(function() {
                return false;
            });
            $target.mouseup(function() {
                return false;
            });
        }

        var more = function() {
            $this.addClass("shown");
            $target.addClass("collapse-expand");
        };
        var less = function() {
            var height
            if ($target.offset().top < $this.offset().top) {
                height = $target.height();
            }
            $this.removeClass("shown");
            $target.removeClass("collapse-expand");

            if (height) {
                height = $(document).scrollTop() + $target.height() - height;
                $(document).scrollTop(height);
            }
        };

        var showText = function() {
            if (opt.showText) {
                if ($this.find("span").length > 0) {
                    $this.find("span").text(opt.showText);
                } else {
                    $this.text(opt.showText);
                }
            }
        };

        var hideText = function() {
            if (opt.hideText) {
                if ($this.find("span").length > 0) {
                    $this.find("span").text(opt.hideText);
                } else {
                    $this.text(opt.hideText);
                }
            }
        };

        var appear = function() {
            if ($this.hasClass("shown")) {
                hide();
                hideText();
            } else {
                show();
                showText();
            }
        };

        var expand = function() {
            if ($this.hasClass("shown")) {
                less();
                hideText();
            } else {
                more();
                showText();
            }
        };
        var resetForExpand = function() {
            if ($target.prop('scrollHeight') > $target.prop('offsetHeight')) {
                $this.css('visibility', 'visible');
            } else {
                $this.css('visibility', 'hidden');
            }
        }

        var obj = {};
        switch (opt.type) {
            case "expand":
                $this.click(expand);
                obj.toggle = expand;
                $(document).on("dom.resize", resetForExpand);
                resetForExpand();
                break;
            default:
                $this.click(appear);
                obj.toggle = appear;
                break;
        }
        $this.data('collapse', obj);
        $this.attr('role','Collapse'+opt.type);
        return obj;
    };

    $(document).on('dom.load.collapse', function() {
        $("[data-collapse]").each(function(index, item) {
            var $this = $(item);
            $this.collapse({
                type: $this.attr("data-collapse"),
                showText: $this.attr("data-showtext"),
                hideText: $this.attr("data-hidetext"),
                target: $this.attr("data-target"),
                autoClose: $this.attr("data-autoclose"),
                offsetTop: $this.attr("data-offsettop")
            });
            $this.removeAttr('data-collapse');
        });
    });
})(jQuery);

//dialog plugin
(function($) {

    $.fn.dialog = function(opt) {
        var $this = $(this);

        if ($this.data('dialog')) {
            return $this.data('dialog');
        }
        var defaultOpt = {
            onShow: null,
            onHide: null,
            autoClose: true,
            cache: false,
            before: null,
            theme: '',
            html: '',
        };

        opt = $.extend({}, defaultOpt, opt);

        if (opt.before) {
            if ($.isFunction(opt.before)) {
                opt.before();
            } else {
                $(document).trigger(opt.before);
            }
        }
        // before && $.isFunction(before) && before();

        var dialogHeader = $('<div class="dialog-header"> <a class="dialog-header-close" href="javascript:;"><i class="icon-remove"></i></a></div>');
        var dialogBody = $('<div class="dialog-body" utmsection="popup"></div>');
        if (opt.cache) {
            dialogBody.append(opt.html || $this.html());
        }
        var dialogPanel = $('<div class="dialog-panel"></div>').append(dialogHeader).append(dialogBody);
        var dialogOverLay = $('<div class="dialog-overlay"></div>').hide();

        var dialog = $('<div class="dialog ' + opt.theme + '" tabIndex="-1"></div>');
        dialog.prepend(dialogOverLay);
        dialog.append(dialogPanel).hide();
        $('body').append(dialog);

        function reposition() {
            var height = $(window).height() - dialogPanel.outerHeight();
            if (height > 0) {
                dialogPanel.css({
                    marginTop: height / 2 + 'px'
                });
            } else {
                dialogPanel.css({
                    marginTop: 20
                });
            }
        }

        function beforeshow() {
            //hide other dialog
            $('.dialog-overlay').hide();
            $('.dialog').each(function() {
                if (this !== dialog.get(0))
                    $(this).data('dialog').close();
            });

            if (opt.before) {
                if ($.isFunction(opt.before)) {
                    opt.before();
                } else {
                    $(document).trigger(opt.before, [opt.trigger]);
                }
            }
        }

        function show() {
            beforeshow();
            if (!opt.cache) {
                dialog.find('.dialog-body').html(opt.html || $this.html());
                $(document).trigger('dom.load');
            }
            if (opt.onShow) {
                if ($.isFunction(opt.onShow)) {
                    opt.onShow();
                } else {
                    $(document).trigger(opt.onShow, [opt.trigger]);
                }
            }

            $('body').addClass('dialog-show');
            dialog.fadeIn(300);
            dialogOverLay.fadeIn(300);
            setTimeout(function() {
                reposition();
            }, 50);
        }

        function hide() {
            $('body').removeClass('dialog-show');

            dialog.fadeOut(300);
            dialogOverLay.fadeOut(300);
            if (opt.onHide) {
                if ($.isFunction(opt.onHide)) {
                    opt.onHide();
                } else {
                    $(document).trigger(opt.onHide, [opt.trigger]);
                }
            }
            if (!opt.cache) {
                destroy();
            }
        }
        dialog.on('keydown', function(event) {
            if (event.which == 27) {
                hide();
            }
        });

        function destroy() {
            $this.data('dialog', null);
            dialog.remove();
            dialogOverLay.remove();
        }
        var dialogObj = {
            open: show,
            close: hide,
            destroy: destroy,
            setHtml: function(htmlStr) {
                opt.html = htmlStr;
            },
            setOption: function(key, value) {
                if (typeof key === 'string') {
                    opt[key] = value;
                } else {
                    opt = $.extend(opt, key);
                }
            }
        };
        $this.data('dialog', dialogObj);
        dialog.data('dialog', dialogObj);

        dialogHeader.on('click', function() {
            hide();
        });
        // if(opt.theme="dialog-dropdown") {
        // @conjee, do you mean "=="?
        if (opt.theme == "dialog-dropdown") {
            dialogBody.on('click', "a", function() {
                setTimeout(function() {
                    hide();
                }, 10);
            });
        }

        if (opt.autoClose) {
            dialogOverLay.click(hide);
        }
        $(document).on('dom.resize', function() {
            reposition();
        });
        $this.attr('role', 'Dialog');
        return $this.data('dialog');
    };

    $(document).on('click.dialog', '[data-dialog]', function() {
        var dialog = initBtn(this);
        $(this).removeAttr('data-dialog');
        dialog.setOption('trigger', $(this));
        return dialog.open();
    });

    $.fn.btnDialog = function() {
        return initBtn(this);
    };

    function initBtn(that) {
        var $this = $(that);
        var target = $this.attr('data-target') || {};
        var canCache = $this.attr('data-cache');
        var onShow = $this.attr('data-onshow');
        var onHide = $this.attr('data-onhide');
        var before = $this.attr('data-before');
        var theme = $this.attr('data-theme');
        var dialog = $(target).dialog({
            cache: canCache,
            onShow: onShow,
            onHide: onHide,
            before: before,
            theme: theme
        });
        $this.click(function() {
            var tmp = $(target).data('dialog');
            if (!tmp) {
                tmp = $(target).dialog({
                    cache: canCache,
                    onShow: onShow,
                    onHide: onHide,
                    before: before,
                    theme: theme
                });
            }
            tmp.setOption('trigger', $(this));
            tmp.open();
            return false;
        });
        return dialog;
    }
})(jQuery);
(function($) {

    $.fn.dropdownmenu = function() {
        var $this = $(this);
        var $link = $(this).find('.caret');
        var $item = $(this).find('.dropdown-item');
        var timer = null;

        var checkOverFlow = function() {
            $this.find('li').removeClass('fullline');
            var showLink = false;
            var top = $item.find('li:eq(0)').offset().top;
            $item.find('li').removeClass('first');
            $item.find('li').each(function(index, item) {
                if (($(item).offset().top - top) < 10 && ($(item).offset().top - top) > -10) {
                    $(item).removeClass('fullline');
                } else {
                    $(item).addClass('fullline');
                    showLink = true;
                }
            });
            $item.find('.fullline:eq(0)').addClass('first');

            if (showLink) {
                $link.show();
            } else {
                $link.hide();
            }
        };

        var expand = function() {
            $this.addClass('active');
        };

        var close = function() {
            $this.removeClass('active');
        };

        var toggle = function() {
            if ($this.hasClass('active')) {
                close();
            } else {
                $(document).trigger('mouseup.dropdownmenu');
                expand();
                $(document).off('mouseup.dropdownmenu').one('mouseup.menu', function(e) {
                    close();
                });
            }
        };

        var namespace = {
            expand: expand,
            this: this,
            toggle: toggle,
            refresh:checkOverFlow
        };

        $link.mouseup(function() {
            return false;
        });

        $link.on('click', toggle);

        $(document).on('dom.resize', function() {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function() {
                checkOverFlow();
            }, 200);
        });
        checkOverFlow();
        $this.attr('role','Dropdownmenu');
        return $this.data('dropdownmenu', namespace);
    }

    $(document).on('dom.load.dropdownmenu', function() {
        $('[data-dropdownmenu]').each(function(index, item) {
            $(item).dropdownmenu();
            $(item).removeAttr('data-dropdownmenu');
        });
    });

})(jQuery);

(function($) {
    $(document).on("dom.load", function() {
        $.csv = function() {
            var namespace = {};

            namespace.getDataFromTable = function(id) {
                var trList = $("#" + id).find("tr");
                var array = [];
                for (var i = 0; i < trList.length; i++) {
                    var items = [];
                    var tdList = $(trList[i]).find("td,th");
                    for (var j = 0; j < tdList.length; j++) {
                        items.push('"' + $.trim($(tdList[j]).text()).replace(/\n/g, '').replace(/\s{2,}/g, '    ') + '"');
                    }
                    array.push(items);
                }
                return array;
            };
            namespace.get = function(array, fileName) {
                var str = "";
                for (var i = 0; i < array.length; i++) {
                    if (array[i].length > 0) {
                        str += array[i].join(",").replace(/—/g, '-') + "\n";
                    }
                }
                return str;
            };
            return namespace;
        }();
        $.ics = function() {
            var namespace = {};
            if (!$("#sendICSForm").length) {
                var form = $('<form method="post" action="' + context.appUrl + 'getics" name="sendICSForm"  id="sendICSForm"></form>');
                form.append($('<input type="hidden" name="icsContent" id="icsStr">'));
                form.append($('<input type="hidden" name="icsFileName" id="icsFileName">'));
                $("body").append(form);
            }
            namespace.get = function(content, fileName) {
                if (content) {
                    $("#icsStr").val(JSON.stringify(content));
                    $('#icsFileName').val(fileName ? fileName : "");
                    $("#sendICSForm").submit();
                }
            };
            return namespace;
        }();

    });


    $.fn.csv = function(option) {
        var defaultOpt = {
            data: null,
            name: ''
        };
        var opt = $.extend({}, defaultOpt, option);
        var $this = $(this);
        var _download = function() {
            var content;
            if (typeof opt.data === 'string') {
                content = $.csv.get($.call(opt.data), opt.name);
            } else {
                content = $.csv.get(opt.data, opt.name);
            }
            var str = encodeURIComponent(content);
            var href = 'data:text/csv;charset=utf-8,' + str;
            var fileName = opt.name || 'Market_Snapshot.csv';
            var link = $('<a id="downLink" style="display: none;" href="' + href + '" download="' + fileName + '">link</a>');
            $('body').append(link);
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(new Blob([content], {
                    type: 'text/csv;charset=utf-8;'
                }), fileName);
            } else {
                link[0].click();
            }
            setTimeout(function() {
                link.remove();
            });
        };
        $this.on('click', _download);
        var namespace = {
            download: _download
        };
        $this.data("csv", namespace);
        $this.attr('role','ExportCSV');
        return namespace;
    };

    $.fn.ics = function(option) {
        var defaultOpt = {
            data: '',
            name: ''
        };
        var opt = $.extend({}, defaultOpt, option);
        var $this = $(this);

        var _download = function() {
            var content;
            if (typeof opt.data === 'string') {
                content = $.ics.get($.call(opt.data), opt.name);
            } else {
                content = $.ics.get(opt.data, opt.name);
            }
            var str = encodeURIComponent(content);
            var href = 'data:text/ics;charset=utf-8,' + str;
            var fileName = opt.name || 'Market_Snapshot.ics';
            var link = $('<a id="downLink" style="display: none;" href="' + href + '" download="' + fileName + '">link</a>');
            $('body').append(link);
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(new Blob([content], {
                    type: 'text/ics;charset=utf-8;'
                }), fileName);
            } else {
                link[0].click();
            }
            setTimeout(function() {
                link.remove();
            });
        };

        $this.on('click', _download);
        var namespace = {
            download: _download
        };
        $this.data("ics", namespace);
        $this.attr('role','ExportICS');
        return namespace;
    };

    $(document).on('click', '[data-export]', function() {
        var $this = $(this);
        var type = $this.attr('data-export');
        $this[type]({
            data: $this.attr('data-call'),
            name: $this.attr('data-name')
        }).download();
        $this.removeAttr('data-export');
    });

})(jQuery);

(function($) {
    $.fn.fulidvideo = function() {
        var $this = $(this);

        if ($this.closest('.video-wrap').length == 0) {
            $this.wrap('<div class="video-wrap"></div>');
        }
    }
    $(document).on("dom.load", function() {
        $("[data-fulidvideo]").each(function() {
            $(this).find("iframe").each(function(index, item) {
                $(item).fulidvideo();
            });
            $(this).removeAttr('data-fulidvideo');
        });

    });
})(jQuery);
(function($) {
    $.fn.gridtable = function(option) {
        var defaultOption = {
            columns: [{
                text: '',
                colspan: 1
            }]
        };
        var opt = $.extend({}, defaultOption, option);
        var $this = $(this);
        var inital = function() {
            var classname = 'table-' + +new Date();
            var colIndex = 0;
            for (var i = 0; i < opt.columns.length; i++) {
                var column = opt.columns[i];
                colIndex = colIndex + 1;
                $.insertCSS(['.'+classname + ' td:nth-of-type(' + colIndex + '):before'], 'content:"' + column.text + '";');
                if (column.colspan > 1) {
                    colIndex = colIndex + column.colspan-1;
                }
            }
            return classname;
        }
        $this.addClass(inital());
        $this.addClass("GridTable");
        $this.attr('role','grid table');
    };

    $(document).ready(function() {
        $("[data-gridtable]").each(function(index, item) {
            $(item).each(function(index, item) {
                var option = {
                    columns: $(item).find("thead th").map(function(index,item) {
                        return {
                            text: $(item).text(),
                            colspan: $(item).attr('colspan') * 1 || 1
                        };
                    })
                };
                $(item).gridtable(option);
            });
            $(item).removeAttr('data-gridtable');
        });
    });
})(jQuery);

(function($) {
    $.fn.inputformat = function(option) {
        var $this = $(this);
        var defaultOpt = {
            type: "phone"
        };
        var opt = $.extend(defaultOpt, option);
        var timer = null;

        var _formatInput = function(value) {
            var formatString = "";
            switch (opt.type) {
                case "phone":
                    if (value.length >= 4) {
                        formatString += value.slice(0, 3) + "-";
                        if (value.length >= 7) {
                            formatString += value.slice(3, 6) + "-";
                            formatString += value.slice(6, value.length);
                        } else {
                            formatString += value.slice(3, value.length);
                        }
                    } else {
                        formatString += value;
                    }

                    break;
            }
            return formatString;
        }

        if ($.isInt($this.val())) {
            var formatString = _formatInput($this.val());
            $this.prop("rawValue", $this.val());
            $this.val(formatString);
        }

        $this.on("keyup", function() {
            var $this = $(this);
            var value = $this.val().replace(/-/g, "");
            if (timer) {
                clearTimeout(timer);
            }

            var formatString = _formatInput(value);
            $this.prop("rawValue", value);
            $this.val(formatString);

        });
        $this.attr('role','PhoneInput');
    }
})(jQuery);

// jquery.event.move
//
// 1.3.1
//
// Stephen Band
//
// Triggers 'movestart', 'move' and 'moveend' events after
// mousemoves following a mousedown cross a distance threshold,
// similar to the native 'dragstart', 'drag' and 'dragend' events.
// Move events are throttled to animation frames. Move event objects
// have the properties:
//
// pageX:
// pageY:   Page coordinates of pointer.
// startX:
// startY:  Page coordinates of pointer at movestart.
// distX:
// distY:  Distance the pointer has moved since movestart.
// deltaX:
// deltaY:  Distance the finger has moved since last event.
// velocityX:
// velocityY:  Average velocity over last few events.


(function(module) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], module);
    } else {
        // Browser globals
        module(jQuery);
    }
})(function(jQuery, undefined) {

    var // Number of pixels a pressed pointer travels before movestart
    // event is fired.
        threshold = 6,

        add = jQuery.event.add,

        remove = jQuery.event.remove,

        // Just sugar, so we can have arguments in the same order as
        // add and remove.
        trigger = function(node, type, data) {
            jQuery.event.trigger(type, data, node);
        },

        // Shim for requestAnimationFrame, falling back to timer. See:
        // see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
        requestFrame = (function() {
            return (
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(fn, element) {
                    return window.setTimeout(function() {
                        fn();
                    }, 25);
                }
            );
        })(),

        ignoreTags = {
            textarea: true,
            input: true,
            select: true,
            button: true
        },

        mouseevents = {
            move: 'mousemove',
            cancel: 'mouseup dragstart',
            end: 'mouseup'
        },

        touchevents = {
            move: 'touchmove',
            cancel: 'touchend',
            end: 'touchend'
        };


    // Constructors

    function Timer(fn) {
        var callback = fn,
            active = false,
            running = false;

        function trigger(time) {
            if (active) {
                callback();
                requestFrame(trigger);
                running = true;
                active = false;
            } else {
                running = false;
            }
        }

        this.kick = function(fn) {
            active = true;
            if (!running) {
                trigger();
            }
        };

        this.end = function(fn) {
            var cb = callback;

            if (!fn) {
                return;
            }

            // If the timer is not running, simply call the end callback.
            if (!running) {
                fn();
            }
            // If the timer is running, and has been kicked lately, then
            // queue up the current callback and the end callback, otherwise
            // just the end callback.
            else {
                callback = active ?
                    function() {
                        cb();
                        fn();
                } :
                    fn;

                active = true;
            }
        };
    }


    // Functions

    function returnTrue() {
        return true;
    }

    function returnFalse() {
        return false;
    }

    function preventDefault(e) {
        e.preventDefault();
    }

    function preventIgnoreTags(e) {
        // Don't prevent interaction with form elements.
        if (ignoreTags[e.target.tagName.toLowerCase()]) {
            return;
        }

        e.preventDefault();
    }

    function isLeftButton(e) {
        // Ignore mousedowns on any button other than the left (or primary)
        // mouse button, or when a modifier key is pressed.
        return (e.which === 1 && !e.ctrlKey && !e.altKey);
    }

    function identifiedTouch(touchList, id) {
        var i, l;

        if (touchList.identifiedTouch) {
            return touchList.identifiedTouch(id);
        }

        // touchList.identifiedTouch() does not exist in
        // webkit yet… we must do the search ourselves...

        i = -1;
        l = touchList.length;

        while (++i < l) {
            if (touchList[i].identifier === id) {
                return touchList[i];
            }
        }
    }

    function changedTouch(e, event) {
        var touch = identifiedTouch(e.changedTouches, event.identifier);

        // This isn't the touch you're looking for.
        if (!touch) {
            return;
        }

        // Chrome Android (at least) includes touches that have not
        // changed in e.changedTouches. That's a bit annoying. Check
        // that this touch has changed.
        if (touch.pageX === event.pageX && touch.pageY === event.pageY) {
            return;
        }

        return touch;
    }


    // Handlers that decide when the first movestart is triggered

    function mousedown(e) {
        var data;

        if (!isLeftButton(e)) {
            return;
        }

        data = {
            target: e.target,
            startX: e.pageX,
            startY: e.pageY,
            timeStamp: e.timeStamp
        };

        add(document, mouseevents.move, mousemove, data);
        add(document, mouseevents.cancel, mouseend, data);
    }

    function mousemove(e) {
        var data = e.data;

        checkThreshold(e, data, e, removeMouse);
    }

    function mouseend(e) {
        removeMouse();
    }

    function removeMouse() {
        remove(document, mouseevents.move, mousemove);
        remove(document, mouseevents.cancel, mouseend);
    }

    function touchstart(e) {
        var touch, template;

        // Don't get in the way of interaction with form elements.
        if (ignoreTags[e.target.tagName.toLowerCase()]) {
            return;
        }

        touch = e.changedTouches[0];

        // iOS live updates the touch objects whereas Android gives us copies.
        // That means we can't trust the touchstart object to stay the same,
        // so we must copy the data. This object acts as a template for
        // movestart, move and moveend event objects.
        template = {
            target: touch.target,
            startX: touch.pageX,
            startY: touch.pageY,
            timeStamp: e.timeStamp,
            identifier: touch.identifier
        };

        // Use the touch identifier as a namespace, so that we can later
        // remove handlers pertaining only to this touch.
        add(document, touchevents.move + '.' + touch.identifier, touchmove, template);
        add(document, touchevents.cancel + '.' + touch.identifier, touchend, template);
    }

    function touchmove(e) {
        var data = e.data,
            touch = changedTouch(e, data);

        if (!touch) {
            return;
        }

        checkThreshold(e, data, touch, removeTouch);
    }

    function touchend(e) {
        var template = e.data,
            touch = identifiedTouch(e.changedTouches, template.identifier);

        if (!touch) {
            return;
        }

        removeTouch(template.identifier);
    }

    function removeTouch(identifier) {
        remove(document, '.' + identifier, touchmove);
        remove(document, '.' + identifier, touchend);
    }


    // Logic for deciding when to trigger a movestart.

    function checkThreshold(e, template, touch, fn) {
        var distX = touch.pageX - template.startX,
            distY = touch.pageY - template.startY;

        // Do nothing if the threshold has not been crossed.
        if ((distX * distX) + (distY * distY) < (threshold * threshold)) {
            return;
        }

        triggerStart(e, template, touch, distX, distY, fn);
    }

    function handled() {
        // this._handled should return false once, and after return true.
        this._handled = returnTrue;
        return false;
    }

    function flagAsHandled(e) {
        e._handled();
    }

    function triggerStart(e, template, touch, distX, distY, fn) {
        var node = template.target,
            touches, time;

        touches = e.targetTouches;
        time = e.timeStamp - template.timeStamp;

        // Create a movestart object with some special properties that
        // are passed only to the movestart handlers.
        template.type = 'movestart';
        template.distX = distX;
        template.distY = distY;
        template.deltaX = distX;
        template.deltaY = distY;
        template.pageX = touch.pageX;
        template.pageY = touch.pageY;
        template.velocityX = distX / time;
        template.velocityY = distY / time;
        template.targetTouches = touches;
        template.finger = touches ?
            touches.length :
            1;

        // The _handled method is fired to tell the default movestart
        // handler that one of the move events is bound.
        template._handled = handled;

        // Pass the touchmove event so it can be prevented if or when
        // movestart is handled.
        template._preventTouchmoveDefault = function() {
            e.preventDefault();
        };

        // Trigger the movestart event.
        trigger(template.target, template);

        // Unbind handlers that tracked the touch or mouse up till now.
        fn(template.identifier);
    }


    // Handlers that control what happens following a movestart

    function activeMousemove(e) {
        var event = e.data.event,
            timer = e.data.timer;

        updateEvent(event, e, e.timeStamp, timer);
    }

    function activeMouseend(e) {
        var event = e.data.event,
            timer = e.data.timer;

        removeActiveMouse();

        endEvent(event, timer, function() {
            // Unbind the click suppressor, waiting until after mouseup
            // has been handled.
            setTimeout(function() {
                remove(event.target, 'click', returnFalse);
            }, 0);
        });
    }

    function removeActiveMouse(event) {
        remove(document, mouseevents.move, activeMousemove);
        remove(document, mouseevents.end, activeMouseend);
    }

    function activeTouchmove(e) {
        var event = e.data.event,
            timer = e.data.timer,
            touch = changedTouch(e, event);

        if (!touch) {
            return;
        }

        // Stop the interface from gesturing
        e.preventDefault();

        event.targetTouches = e.targetTouches;
        updateEvent(event, touch, e.timeStamp, timer);
    }

    function activeTouchend(e) {
        var event = e.data.event,
            timer = e.data.timer,
            touch = identifiedTouch(e.changedTouches, event.identifier);

        // This isn't the touch you're looking for.
        if (!touch) {
            return;
        }

        removeActiveTouch(event);
        endEvent(event, timer);
    }

    function removeActiveTouch(event) {
        remove(document, '.' + event.identifier, activeTouchmove);
        remove(document, '.' + event.identifier, activeTouchend);
    }


    // Logic for triggering move and moveend events

    function updateEvent(event, touch, timeStamp, timer) {
        var time = timeStamp - event.timeStamp;

        event.type = 'move';
        event.distX = touch.pageX - event.startX;
        event.distY = touch.pageY - event.startY;
        event.deltaX = touch.pageX - event.pageX;
        event.deltaY = touch.pageY - event.pageY;

        // Average the velocity of the last few events using a decay
        // curve to even out spurious jumps in values.
        event.velocityX = 0.3 * event.velocityX + 0.7 * event.deltaX / time;
        event.velocityY = 0.3 * event.velocityY + 0.7 * event.deltaY / time;
        event.pageX = touch.pageX;
        event.pageY = touch.pageY;

        timer.kick();
    }

    function endEvent(event, timer, fn) {
        timer.end(function() {
            event.type = 'moveend';

            trigger(event.target, event);

            return fn && fn();
        });
    }


    // jQuery special event definition

    function setup(data, namespaces, eventHandle) {
        // Stop the node from being dragged
        //add(this, 'dragstart.move drag.move', preventDefault);

        // Prevent text selection and touch interface scrolling
        //add(this, 'mousedown.move', preventIgnoreTags);

        // Tell movestart default handler that we've handled this
        add(this, 'movestart.move', flagAsHandled);

        // Don't bind to the DOM. For speed.
        return true;
    }

    function teardown(namespaces) {
        remove(this, 'dragstart drag', preventDefault);
        remove(this, 'mousedown touchstart', preventIgnoreTags);
        remove(this, 'movestart', flagAsHandled);

        // Don't bind to the DOM. For speed.
        return true;
    }

    function addMethod(handleObj) {
        // We're not interested in preventing defaults for handlers that
        // come from internal move or moveend bindings
        if (handleObj.namespace === "move" || handleObj.namespace === "moveend") {
            return;
        }

        // Stop the node from being dragged
        add(this, 'dragstart.' + handleObj.guid + ' drag.' + handleObj.guid, preventDefault, undefined, handleObj.selector);

        // Prevent text selection and touch interface scrolling
        add(this, 'mousedown.' + handleObj.guid, preventIgnoreTags, undefined, handleObj.selector);
    }

    function removeMethod(handleObj) {
        if (handleObj.namespace === "move" || handleObj.namespace === "moveend") {
            return;
        }

        remove(this, 'dragstart.' + handleObj.guid + ' drag.' + handleObj.guid);
        remove(this, 'mousedown.' + handleObj.guid);
    }

    jQuery.event.special.movestart = {
        setup: setup,
        teardown: teardown,
        add: addMethod,
        remove: removeMethod,

        _default: function(e) {
            var template, data;

            // If no move events were bound to any ancestors of this
            // target, high tail it out of here.
            if (!e._handled()) {
                return;
            }

            template = {
                target: e.target,
                startX: e.startX,
                startY: e.startY,
                pageX: e.pageX,
                pageY: e.pageY,
                distX: e.distX,
                distY: e.distY,
                deltaX: e.deltaX,
                deltaY: e.deltaY,
                velocityX: e.velocityX,
                velocityY: e.velocityY,
                timeStamp: e.timeStamp,
                identifier: e.identifier,
                targetTouches: e.targetTouches,
                finger: e.finger
            };

            data = {
                event: template,
                timer: new Timer(function(time) {
                    trigger(e.target, template);
                })
            };

            if (e.identifier === undefined) {
                // We're dealing with a mouse
                // Stop clicks from propagating during a move
                add(e.target, 'click', returnFalse);
                add(document, mouseevents.move, activeMousemove, data);
                add(document, mouseevents.end, activeMouseend, data);
            } else {
                // We're dealing with a touch. Stop touchmove doing
                // anything defaulty.
                e._preventTouchmoveDefault();
                add(document, touchevents.move + '.' + e.identifier, activeTouchmove, data);
                add(document, touchevents.end + '.' + e.identifier, activeTouchend, data);
            }
        }
    };

    jQuery.event.special.move = {
        setup: function() {
            // Bind a noop to movestart. Why? It's the movestart
            // setup that decides whether other move events are fired.
            add(this, 'movestart.move', jQuery.noop);
        },

        teardown: function() {
            remove(this, 'movestart.move', jQuery.noop);
        }
    };

    jQuery.event.special.moveend = {
        setup: function() {
            // Bind a noop to movestart. Why? It's the movestart
            // setup that decides whether other move events are fired.
            add(this, 'movestart.moveend', jQuery.noop);
        },

        teardown: function() {
            remove(this, 'movestart.moveend', jQuery.noop);
        }
    };

    add(document, 'mousedown.move', mousedown);
    add(document, 'touchstart.move', touchstart);

    // Make jQuery copy touch event properties over to the jQuery event
    // object, if they are not already listed. But only do the ones we
    // really need. IE7/8 do not have Array#indexOf(), but nor do they
    // have touch events, so let's assume we can ignore them.
    if (typeof Array.prototype.indexOf === 'function') {
        (function(jQuery, undefined) {
            var props = ["changedTouches", "targetTouches"],
                l = props.length;

            while (l--) {
                if (jQuery.event.props.indexOf(props[l]) === -1) {
                    jQuery.event.props.push(props[l]);
                }
            }
        })(jQuery);
    };
});
// jQuery.event.swipe
// 0.5
// Stephen Band

// Dependencies
// jQuery.event.move 1.2

// One of swipeleft, swiperight, swipeup or swipedown is triggered on
// moveend, when the move has covered a threshold ratio of the dimension
// of the target node, or has gone really fast. Threshold and velocity
// sensitivity changed with:
//
// jQuery.event.special.swipe.settings.threshold
// jQuery.event.special.swipe.settings.sensitivity

(function (thisModule) {
	if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], thisModule);
    } else if ((typeof module !== "undefined" && module !== null) && module.exports) {
        module.exports = thisModule;
	} else {
		// Browser globals
        thisModule(jQuery);
	}
})(function(jQuery, undefined){
	var add = jQuery.event.add,
	   
	    remove = jQuery.event.remove,

	    // Just sugar, so we can have arguments in the same order as
	    // add and remove.
	    trigger = function(node, type, data) {
	    	jQuery.event.trigger(type, data, node);
	    },

	    settings = {
	    	// Ratio of distance over target finger must travel to be
	    	// considered a swipe.
	    	threshold: 0.4,
	    	// Faster fingers can travel shorter distances to be considered
	    	// swipes. 'sensitivity' controls how much. Bigger is shorter.
	    	sensitivity: 6
	    };

	function moveend(e) {
		var w, h, event;

		w = e.currentTarget.offsetWidth;
		h = e.currentTarget.offsetHeight;

		// Copy over some useful properties from the move event
		event = {
			distX: e.distX,
			distY: e.distY,
			velocityX: e.velocityX,
			velocityY: e.velocityY,
			finger: e.finger
		};

		// Find out which of the four directions was swiped
		if (e.distX > e.distY) {
			if (e.distX > -e.distY) {
				if (e.distX/w > settings.threshold || e.velocityX * e.distX/w * settings.sensitivity > 1) {
					event.type = 'swiperight';
					trigger(e.currentTarget, event);
				}
			}
			else {
				if (-e.distY/h > settings.threshold || e.velocityY * e.distY/w * settings.sensitivity > 1) {
					event.type = 'swipeup';
					trigger(e.currentTarget, event);
				}
			}
		}
		else {
			if (e.distX > -e.distY) {
				if (e.distY/h > settings.threshold || e.velocityY * e.distY/w * settings.sensitivity > 1) {
					event.type = 'swipedown';
					trigger(e.currentTarget, event);
				}
			}
			else {
				if (-e.distX/w > settings.threshold || e.velocityX * e.distX/w * settings.sensitivity > 1) {
					event.type = 'swipeleft';
					trigger(e.currentTarget, event);
				}
			}
		}
	}

	function getData(node) {
		var data = jQuery.data(node, 'event_swipe');
		
		if (!data) {
			data = { count: 0 };
			jQuery.data(node, 'event_swipe', data);
		}
		
		return data;
	}

	jQuery.event.special.swipe =
	jQuery.event.special.swipeleft =
	jQuery.event.special.swiperight =
	jQuery.event.special.swipeup =
	jQuery.event.special.swipedown = {
		setup: function( data, namespaces, eventHandle ) {
			var data = getData(this);

			// If another swipe event is already setup, don't setup again.
			if (data.count++ > 0) { return; }

			add(this, 'moveend', moveend);

			return true;
		},

		teardown: function() {
			var data = getData(this);

			// If another swipe event is still setup, don't teardown.
			if (--data.count > 0) { return; }

			remove(this, 'moveend', moveend);

			return true;
		},

		settings: settings
	};
});

//tip
! function($) {
    var Tooltip = function(element, options) {
        this.type = null
        this.options = null
        this.enabled = null
        this.timeout = null
        this.hoverState = null
        this.$element = null

        this.init('tooltip', element, options)
    }

    Tooltip.TRANSITION_DURATION = 150

    Tooltip.DEFAULTS = {
        animation: true,
        placement: 'top',
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'focus',
        title: '',
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        }
    }

    Tooltip.prototype.init = function(type, element, options) {
        this.enabled = true
        this.type = type
        this.$element = $(element)
        this.options = this.getOptions(options)
        this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

        if (this.$element[0] instanceof document.constructor && !this.options.selector) {
            throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
        }

        var triggers = this.options.trigger.split(' ')

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i]

            if (trigger == 'click') {
                this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
            } else if (trigger != 'manual') {
                var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin'
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

                this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
                this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
            }
        }

        this.options.selector ?
            (this._options = $.extend({}, this.options, {
            trigger: 'manual',
            selector: ''
        })) :
            this.fixTitle()
    }

    Tooltip.prototype.getDefaults = function() {
        return Tooltip.DEFAULTS
    }

    Tooltip.prototype.getOptions = function(options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options)

        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            }
        }

        return options
    }

    Tooltip.prototype.getDelegateOptions = function() {
        var options = {}
        var defaults = this.getDefaults()

        this._options && $.each(this._options, function(key, value) {
            if (defaults[key] != value) options[key] = value
        })

        return options
    }

    Tooltip.prototype.enter = function(obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type)

        if (self && self.$tip && self.$tip.is(':visible')) {
            self.hoverState = 'in'
            return
        }

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
            $(obj.currentTarget).data('bs.' + this.type, self)
        }

        clearTimeout(self.timeout)

        self.hoverState = 'in'

        if (!self.options.delay || !self.options.delay.show) return self.show()

        self.timeout = setTimeout(function() {
            if (self.hoverState == 'in') self.show()
        }, self.options.delay.show)
    }

    Tooltip.prototype.leave = function(obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type)

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
            $(obj.currentTarget).data('bs.' + this.type, self)
        }

        clearTimeout(self.timeout)

        self.hoverState = 'out'

        if (!self.options.delay || !self.options.delay.hide) return self.hide()

        self.timeout = setTimeout(function() {
            if (self.hoverState == 'out') self.hide()
        }, self.options.delay.hide)
    }

    Tooltip.prototype.show = function() {
        var e = $.Event('show.bs.' + this.type)

        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e)

            var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
            if (e.isDefaultPrevented() || !inDom) return
            var that = this

            var $tip = this.tip()

            var tipId = this.getUID(this.type)

            this.setContent()
            $tip.attr('id', tipId)
            this.$element.attr('aria-describedby', tipId)

            if (this.options.animation) $tip.addClass('fade')

            var placement = typeof this.options.placement == 'function' ?
                this.options.placement.call(this, $tip[0], this.$element[0]) :
                this.options.placement

            var autoToken = /\s?auto?\s?/i
            var autoPlace = autoToken.test(placement)
            if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

            $tip
                .detach()
                .css({
                    top: 0,
                    left: 0,
                    display: 'block'
                })
                .addClass(placement)
                .data('bs.' + this.type, this)

            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

            var pos = this.getPosition()
            var actualWidth = $tip[0].offsetWidth
            var actualHeight = $tip[0].offsetHeight

            if (autoPlace) {
                var orgPlacement = placement
                var $container = this.options.container ? $(this.options.container) : this.$element.parent()
                var containerDim = this.getPosition($container)

                placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top' :
                    placement == 'top' && pos.top - actualHeight < containerDim.top ? 'bottom' :
                    placement == 'right' && pos.right + actualWidth > containerDim.width ? 'left' :
                    placement == 'left' && pos.left - actualWidth < containerDim.left ? 'right' :
                    placement;

                if(/^top\sleft$|^left\stop$/.test(placement)){
                    if(pos.top - actualHeight < containerDim.top){
                        placement = placement.replace('top', 'bottom');
                    }
                    if((pos.left - actualWidth + 30) < containerDim.left){
                        placement = placement.replace('left', 'right');
                    }
                }
                if(/^top\sright$|^right\stop$/.test(placement)){
                    if(pos.top - actualHeight < containerDim.top){
                        placement = placement.replace('top', 'bottom');
                    }
                    if((pos.right + actualWidth - 30) > containerDim.width){
                        placement = placement.replace('right', 'left');
                    }
                }
                if(/^bottom\sleft$|^left\sbottom$/.test(placement)){
                    console.log(pos.bottom, actualHeight, containerDim.bottom, containerDim);
                    if(pos.bottom + actualHeight > containerDim.bottom){
                        placement = placement.replace('bottom', 'top');
                    }
                    if((pos.left - actualWidth + 30) < containerDim.left){
                        placement = placement.replace('left', 'right');
                    }
                }
                if(/^bottom\sright$|^right\sbottom$/.test(placement)){
                    if(pos.bottom + actualHeight > containerDim.bottom){
                        placement = placement.replace('bottom', 'top');
                    }
                    if((pos.right + actualWidth - 30) > containerDim.width){
                        placement = placement.replace('right', 'left');
                    }
                }

                $tip
                    .removeClass(orgPlacement)
                    .addClass(placement)
            }

            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

            this.applyPlacement(calculatedOffset, placement)

            var complete = function() {
                var prevHoverState = that.hoverState
                that.$element.trigger('shown.bs.' + that.type)
                that.hoverState = null

                if (prevHoverState == 'out') that.leave(that)
            }

            $.support.transition && this.$tip.hasClass('fade') ?
                $tip
                .one('bsTransitionEnd', complete)
                .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
                complete()
        }
    }

    Tooltip.prototype.applyPlacement = function(offset, placement) {
        var $tip = this.tip()
        var width = $tip[0].offsetWidth
        var height = $tip[0].offsetHeight

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($tip.css('margin-top'), 10)
        var marginLeft = parseInt($tip.css('margin-left'), 10)

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop)) marginTop = 0
        if (isNaN(marginLeft)) marginLeft = 0

        offset.top = offset.top + marginTop
        offset.left = offset.left + marginLeft

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        $.offset.setOffset($tip[0], $.extend({
            using: function(props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                })
            }
        }, offset), 0)

        $tip.addClass('in')

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth = $tip[0].offsetWidth
        var actualHeight = $tip[0].offsetHeight

        if (/\s?top\s?/.test(placement) && actualHeight != height) {
            offset.top = offset.top + height - actualHeight
        }

        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

        if (delta.left) offset.left += delta.left
        else offset.top += delta.top

        var isVertical = /top|bottom/.test(placement);
        var isExtraHorizontal = false;
        if(isVertical){
            isExtraHorizontal = /left|right/.test(placement);
        }
        var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
        var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

        $tip.offset(offset)
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical, isExtraHorizontal);
    }

    Tooltip.prototype.replaceArrow = function(delta, dimension, isVertical, isExtraHorizontal) {
        if(isVertical && isExtraHorizontal){
            this.arrow()
            .css('left', '')
            .css('top', '');
            return;
        }
        this.arrow()
            .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
            .css(isVertical ? 'top' : 'left', '');
    }

    Tooltip.prototype.setContent = function() {
        var $tip = this.tip()
        var title = this.getTitle()

        $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
        $tip.removeClass('fade in top bottom left right')
    }

    Tooltip.prototype.hide = function(callback) {
        var that = this
        var $tip = $(this.$tip)
        var e = $.Event('hide.bs.' + this.type)

        function complete() {
            if (that.hoverState != 'in') $tip.detach()
            that.$element
                .removeAttr('aria-describedby')
                .trigger('hidden.bs.' + that.type)
            callback && callback()
        }

        this.$element.trigger(e)

        if (e.isDefaultPrevented()) return

        $tip.removeClass('in')

        $.support.transition && $tip.hasClass('fade') ?
            $tip
            .one('bsTransitionEnd', complete)
            .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
            complete()

        this.hoverState = null

        return this
    }

    Tooltip.prototype.fixTitle = function() {
        var $e = this.$element
        if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
            $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
        }
    }

    Tooltip.prototype.hasContent = function() {
        return this.getTitle()
    }

    Tooltip.prototype.getPosition = function($element) {
        $element = $element || this.$element

        var el = $element[0]
        var isBody = el.tagName == 'BODY'

        var elRect = el.getBoundingClientRect()
        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = $.extend({}, elRect, {
                width: elRect.right - elRect.left,
                height: elRect.bottom - elRect.top
            })
        }
        var elOffset = isBody ? {
            top: 0,
            left: 0
        } : $element.offset()
        var scroll = {
            scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop()
        }
        var outerDims = isBody ? {
            width: $(window).width(),
            height: $(window).height()
        } : null

        return $.extend({}, elRect, scroll, outerDims, elOffset)
    }

    Tooltip.prototype.getCalculatedOffset = function(placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? {
                top: pos.top + pos.height,
                left: pos.left + pos.width / 2 - actualWidth / 2
            } :
            placement == 'top' ? {
                top: pos.top - actualHeight,
                left: pos.left + pos.width / 2 - actualWidth / 2
            } :
            placement == 'left' ? {
                top: pos.top + pos.height / 2 - actualHeight / 2,
                left: pos.left - actualWidth
            } :
            /\s?top\s?/.test(placement) && /\s?left\s?/.test(placement) ? {
                top: pos.top - actualHeight,
                left: pos.left - actualWidth + 30
            } :
            /\s?top\s?/.test(placement) && /\s?right\s?/.test(placement) ? {
                top: pos.top - actualHeight,
                left: pos.left + pos.width - 30
            } :
            /\s?bottom\s?/.test(placement) && /\s?left\s?/.test(placement) ? {
                top: pos.top + pos.height,
                left: pos.left - actualWidth + 30
            } :
            /\s?bottom\s?/.test(placement) && /\s?right\s?/.test(placement) ? {
                top: pos.top + pos.height,
                left: pos.left + pos.width - 30
            } :
            /* placement == 'right' */
            {
                top: pos.top + pos.height / 2 - actualHeight / 2,
                left: pos.left + pos.width
            }

    }

    Tooltip.prototype.getViewportAdjustedDelta = function(placement, pos, actualWidth, actualHeight) {
        var delta = {
            top: 0,
            left: 0
        }
        if (!this.$viewport) return delta

        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
        var viewportDimensions = this.getPosition(this.$viewport)

        if (/right|left/.test(placement)) {
            var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
            if (topEdgeOffset < viewportDimensions.top) { // top overflow
                delta.top = viewportDimensions.top - topEdgeOffset
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
            }
        } else {
            var leftEdgeOffset = pos.left - viewportPadding
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth
            if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                delta.left = viewportDimensions.left - leftEdgeOffset
            } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
            }
        }

        return delta
    }

    Tooltip.prototype.getTitle = function() {
        var title
        var $e = this.$element
        var o = this.options

        title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title)

        return title
    }

    Tooltip.prototype.getUID = function(prefix) {
        do prefix += ~~(Math.random() * 1000000)
        while (document.getElementById(prefix))
        return prefix
    }

    Tooltip.prototype.tip = function() {
        return (this.$tip = this.$tip || $(this.options.template))
    }

    Tooltip.prototype.arrow = function() {
        return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
    }

    Tooltip.prototype.enable = function() {
        this.enabled = true
    }

    Tooltip.prototype.disable = function() {
        this.enabled = false
    }

    Tooltip.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled
    }

    Tooltip.prototype.toggle = function(e) {
        var self = this
        if (e) {
            self = $(e.currentTarget).data('bs.' + this.type)
            if (!self) {
                self = new this.constructor(e.currentTarget, this.getDelegateOptions())
                $(e.currentTarget).data('bs.' + this.type, self)
            }
        }

        self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }

    Tooltip.prototype.destroy = function() {
        var that = this
        clearTimeout(this.timeout)
        this.hide(function() {
            that.$element.off('.' + that.type).removeData('bs.' + that.type)
        })
    }

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.tooltip')
            var options = typeof option == 'object' && option

            if (!data && /destroy|hide/.test(option)) return
            if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.tooltip

    $.fn.tooltip = Plugin
    $.fn.tooltip.Constructor = Tooltip

    $.fn.tooltip.noConflict = function() {
        $.fn.tooltip = old
        return this
    }

    $(document).on('dom.load', function() {
        $("[data-tip]").each(function(index, item) {
            var trigger = $(this).attr("data-tip");
            var position = $(this).attr('data-position');
            var trigger = $(this).data('trigger');
            $(this).tooltip({
                placement: position || 'auto top',
                trigger: 'hover focus'
            });
            $(this).removeAttr("data-tip");
        });
    });
}(jQuery);

//popover
! function($) {
    var Popover = function(element, options) {
        this.init('popover', element, options)
    }

    if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: 'right',
        trigger: 'click',
        content: '',
        close: true,
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-title"></div><div class="popover-content"></div></div>'
    })

    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

    Popover.prototype.constructor = Popover

    Popover.prototype.getDefaults = function() {
        return Popover.DEFAULTS
    }

    Popover.prototype.setContent = function() {
        var that = this;
        var $tip = this.tip()
        var title = this.getTitle()
        var content = this.getContent()

        $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
        $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
            this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
        ](content)
        if (this.options.close) {
            var close = $('<a href="javascript:;" class="popover-close"><i class="icon-close"></i></a>').click(function() {
                that.hide();
            });
            $tip.find('.popover-title').append(close);
        }
        $tip.removeClass('fade top bottom left right in')

        // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
        // this manually by checking the contents.
        if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
    }

    Popover.prototype.hasContent = function() {
        return this.getTitle() || this.getContent()
    }

    Popover.prototype.getContent = function() {
        var $e = this.$element
        var o = this.options

        return $e.attr('data-content') || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
    }

    Popover.prototype.arrow = function() {
        return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
    }

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.popover')
            var options = typeof option == 'object' && option

            if (!data && /destroy|hide/.test(option)) return
            if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.popover

    $.fn.popover = Plugin
    $.fn.popover.Constructor = Popover

    $.fn.popover.noConflict = function() {
        $.fn.popover = old
        return this
    }
}(jQuery);
 (function($) {
     $.fn.facebooklink = function() {
         var $this = $(this);
         var namespace = {
             go: function() {
                 var keyword = $this.data("keyword");
                 var url = encodeURIComponent(location.href);
                 if (keyword)
                     url = url + '&t=' + encodeURIComponent(keyword);
                 window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, 'facebook-share-dialog', 'sharer', 'toolbar=0,status=0,width=626,height=436');
             }
         };
         $this.click(namespace.go);
         $this.data('facebooklink', namespace);
         $this.attr('role', 'Facebooklink');
         return namespace;
     };
     $.fn.googlepluslink = function() {
         var $this = $(this);
         var namespace = {
             go: function() {
                 window.open('https://plus.google.com/share?url=' + encodeURIComponent(location.href), 'googlesharer', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
             }
         };
         $this.data('googlepluslink', namespace);
         $this.attr('role', 'Googlepluslink');
         return namespace;
     };
     $.fn.twitterlink = function() {
         var $this = $(this);
         var namespace = {
             go: function() {
                 window.open('http://twitter.com/share?text=Check out this house I found on @MovotoRealEstate&url=' + encodeURIComponent(location.href));
             }
         };
         $this.click(namespace.go);
         $this.data('twitterlink', namespace);
         $this.attr('role', 'Twitterlink');
         return namespace;
     };
     $.fn.phonecall = function() {
         var $this = $(this);
         var number = $this.data("phonecall");
         var namespace = {
             go: function() {
                 window.location.href = "tel:1" + number;
             }
         };
         $this.click(namespace.go);
         $this.data('phonecall', namespace);
         $this.attr('role', 'Phonecall');
         return namespace;
     };
     $.fn.mailto = function() {
         var $this = $(this);
         var mail = $this.data("mailto");
         var params = $this.data("params");
         var namespace = {
             go: function() {
                 var link = "mailto:" + mail;
                 if (params) {
                     link = link + "?" + params;
                 }
                 window.location.href = link;
             }
         }
         $this.click(namespace.go);
         $this.data('mailto', namespace);
         $this.attr('role', 'Mailto');
         return namespace;
     };
     $.fn.msgto = function() {
         var $this = $(this);
         var text = $this.data("msgto");

         var smsChar = (browser && browser.versions.ios) ? '&' : '?';
         var namespace = {
             go: function() {
                 window.location.href = 'sms:' + smsChar + 'body=' + text;
             }
         };
         $this.click(namespace.go);
         $this.data('msgto', namespace);
         $this.attr('role', 'Msgto');
         return namespace;
     };
     $(document).on("click", '[data-link]', function() {
         var $this = $(this);
         var type = $this.attr('data-link');
         var target = $this.attr('data-target');
         switch (type) {
             case 'facebook':
                 $this.facebooklink().go();
                 break;
             case 'googleplus':
                 $this.googlepluslink().go();
                 break;
             case 'twitter':
                 $this.twitterlink().go();
                 break;
             case 'phonecall':
                 $this.phonecall().go();
                 break;
             case 'mailto':
                 $this.mailto().go();
                 break;
             case 'msgto':
                 $this.msgto().go();
                 break;
             case 'focuson':
                 var timer = setTimeout(function() {
                     $(target).focus();
                 }, 100);
                 $this.on("click", function() {
                     if (timer) {
                         clearTimeout(timer);
                     }
                     timer = setTimeout(function() {
                         $(target).focus();
                     }, 100);
                 });
                 break;
             case 'utm':
                 $this.utmlink().go();
                 return false;
                 break;
             default:
                 $.sendRequest($this.attr("href"), {
                     type: "redirect"
                 });
         }
         $this.removeAttr('data-link');
     });
 })(jQuery);
//lazy load image
(function($) {
    var timer;
    var callback;
    $.fn.extend({
        loadImage: function() {
            var buffer = 0.5;
            var top = $(this).scrollTop();
            var bottom = top + $(this).height() * (1 + buffer);
            top = top - $(this).height() * buffer;
            function animateImg(item) {
                $(item).animate({
                    opacity: "1"
                }, 1000, function() {
                    $(item).removeAttr("data-img");
                });
            }
            $("[data-img]").each(function(index, item) {
                var base = $(item).offset().top;
                if (base < bottom && (base + $(item).height()) > top) {
                    var imgsrc = $(item).data("img");
                    if (callback) {
                        callback(item, function() {
                            animateImg(item);
                        });
                    } else {
                        animateImg(item);
                    }
                    imgsrc && $(item).attr("src", imgsrc);
                }
            });
        }
    });

    $.fn.loadImage.setCallback = function(fn) {callback = fn;}

    function initial(e) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            $(window).loadImage();
        }, 10);
    }

    $(document).on('dom.load', function() {
        var $scroll = $("[data-img-scroll]");
        $scroll.each(function() {
            var target = $(this);
            target.on('scroll', function() {
                $(document).trigger('dom.scroll', [target]);
            });
        });
        $scroll.removeAttr("data-img-scroll");
    });

    $(document).on('dom.load dom.scroll dom.resize', function() {
        initial();
    });
})(jQuery);
//show loading (lock page & unlock page)
(function($) {
    // isShow flag for loading
    var isShow = false;
    $.extend({
        showLoading: function() {
            if (!isShow) {
                $('.loading-bg').stop().fadeIn(100);
                $(".loading-img").stop().show();
                isShow = true;
            }
        },
        hideLoading: function() {
            if (isShow) {
                $('.loading-bg').stop().fadeOut(100);
                $(".loading-img").stop().hide();
                isShow = false;
            }
        },
        showScreenLoading: function() {
            if ($(".screenLoading").length === 0) {
                $("body").append($('<div class="screenLoading"></div>'));
            }
            $(".screenLoading").stop().fadeIn(500);
        },
        hideScreenLoading: function() {
            $(".screenLoading").stop().fadeOut(500);
        }
    });


    //var loading = $('mask div').loading();
    //loading.show();
    //loading.hide();
    // make sure the mask div do not have after styles

    $.fn.extend({
        'loading': function() {
            var $this = $(this);
            $this.css('position', 'relative');
            var cname = $this.attr('class');

            return {
                show: function() {
                    $this.attr('class', cname + ' loading');
                },
                hide: function() {
                    $this.attr('class', cname);
                }
            };
        }
    });

    $.extend({
        'loading': {
            showspinner: function(item) {
                $(item).addClass('loading spinner').css('position', 'relative');
            },
            show: function(item, showIcon) {
                $(item).addClass('loading').css('position', 'relative');
            },
            hide: function(item) {
                $(item).removeClass('loading spinner');
            }
        }
    });

})(jQuery);
//menu
(function($) {
    $.fn.menu = function(option) {
        var defaultOption = {
            type: "appear"
        };
        var opt = $.extend(
            defaultOption, option
        );
        var $this = $(this);
        var $list = $this.find('ul');
        var $link = $this.find('>a');
        var $menu = $this;

        var show = function() {
            $(document).trigger('mouseup.menu');
            $link.addClass("active");
            $list.addClass("active");
            $list.show();
            $(document).off("mouseup.menu").one("mouseup.menu", function(e) {
                hide();
            });
        };
        var hide = function() {
            $link.removeClass("active");
            $list.removeClass("active");
            $list.hide();
        };
        var expand = function() {
            $(document).trigger('mouseup.menu');
            $link.addClass("active");
            $list.addClass("active");
            $list.css({
                height: $list.prop('scrollHeight')
            });
            $(document).off("mouseup.menu").one("mouseup.menu", function(e) {
                close();
            });
        };
        var close = function() {
            $link.removeClass("active");
            $list.removeClass("active");
            $list.css({
                height: 0
            });
        };


        var menu = {
            toggle: function() {
                if ($list.is(':hidden') || $list.prop('offsetHeight') === 0) {
                    if (opt.type == "expand") {
                        expand();
                    } else {
                        show();
                    }
                } else {
                    if (opt.type == "expand") {
                        close();
                    } else {
                        hide();
                    }
                }
            }
        };

        $link.mouseup(function() {
            return false;
        });
        $list.mouseup(function() {
            return false;
        });

        //todo posision
        if (opt.type == "expand") {
            close();
        } else {
            hide();
        }
        $link.click(menu.toggle);
        $this.data("menu", menu);
        $this.attr('role','Menu');
        return menu;
    };
    $(document).on('dom.load', function() {
        $("[data-menu]").each(function(index, item) {
            $(item).menu({
                type: $(item).attr("data-menu")
            });
            $(item).removeAttr('data-menu');
        });
    });
})(jQuery);

//pin
(function($) {
    $.fn.pin = function(option) {
        var defaultOpt = {
            top: 50,
            bottom: 0,
            target: ''
        };
        var opt = $.extend({}, defaultOpt, option);

        var $this = $(this);
        var $target = $(opt.target);
        $this.css('position', 'relative');
        $target.addClass('pin');

        var offsetTop = 0;
        var offsetBottom = 0;
        var reposition = function() {
            offsetTop = $this.offset().top - opt.top;
            offsetBottom = offsetTop + $this.height() - $target.height() - opt.bottom;
        };
        var pin = function() {
            $target.css({
                position: 'fixed',
                'top': opt.top,
                bottom: 'auto'
            });
        };
        var unpin = function(isTop) {
            if (isTop) {
                $target.css({
                    position: 'absolute',
                    top: 0,
                    bottom: 'auto'
                });
            } else {
                $target.css({
                    position: 'absolute',
                    top: 'auto',
                    bottom: 0
                });
            }
        };
        var setpin = function(scrollTop, isReposition) {
            if (isReposition) {
                reposition();
            }
            if (scrollTop < offsetTop) {
                unpin(true);
            } else {
                if (scrollTop > offsetBottom) {
                    unpin(false);
                } else {
                    pin();
                }
            }
        };
        $this.data('pin', {
            pin: pin,
            unpin: unpin,
            setpin: setpin
        });
        $target.attr('role','PinPanel');
        return $this.data('pin');
    };


    function initial(isReposition) {
        var scrollTop = $(window).scrollTop();

        $('[data-pin]').each(function() {
            if ($(this).data('pin') && $(this).data('pin').setpin) {
                $(this).data('pin').setpin(scrollTop, isReposition);
            } else {
                $(this).pin({
                    top: $(this).attr('data-top'),
                    bottom: $(this).attr('data-bottom'),
                    target: $(this).attr('data-target')
                }).setpin(scrollTop, true);
            }
        });
    }

    $(window).on('scroll', function(e) {
        initial(false);
    });
    $(window).on('dom.resize', function(e) {
        initial(true);
    });

})(jQuery);

(function($) {
    $.scrollTo = function($target, $scroll, offsettop, time) {
        if (offsettop && offsettop.indexOf('#') >= 0) {
            offsettop = $(offsettop).height() + $("#header").height();
        } else {
            offsettop = (offsettop !== undefined) ? offsettop : $("#header").height();
        }
        $scroll = $("body, html");
        $scroll.animate({
            scrollTop: $target.offset().top - offsettop - 10
        }, time >= 0 ? time : 200);
    };
    $.fn.scrollTo = function(option) {
        var $this = $(this);
        var defaultOption = {
            target: $this,
            onscroll: null
        };
        var opt = $.extend({}, defaultOption, option);

        if ($this.is("select")) {
            $this.change(function() {
                var $item = $("option:selected", $this);
                if (opt.onscroll) {
                    if ($.isFunction(opt.onscroll)) {
                        opt.onscroll($this);
                    } else {
                        $(document).trigger(opt.onscroll, [$this]);
                    }
                }

                $.scrollTo($($item.data("target")), opt.onscroll, opt.offsettop);
            });
        } else {
            $this.click(function() {
                if (opt.onscroll) {
                    if ($.isFunction(opt.onscroll)) {
                        opt.onscroll($this);
                    } else {
                        $(document).trigger(opt.onscroll, [$this]);
                    }
                }
                $.scrollTo(opt.target, opt.onscroll, opt.offsettop);
            });
        }
        $this.attr('role','ScrollTo');
    };

    $(document).on('dom.load.scrollTo', function() {
        if ($('[data-scrollspy]').length > 0) {
            $(document).on('dom.scroll.scrollSpy', function(e, t, isDown, initTop) {
                $('[data-scrollspy]').each(function(index) {
                    var offset = $($(this).attr("data-offsettop"));
                    var target = $($(this).data("target"));
                    var top = offset ? (initTop + offset.height()) : initTop;
                    top += 50;
                    var targetTop = target.offset().top;
                    var targetBottom = target.offset().top + target.height();
                    if (targetTop <= top && targetBottom > top) {
                        $(document).trigger($(this).data('onscroll'), [$(this)]);
                        return false;
                    }
                });

            });
        }

        $('[data-scrollTo]').each(function() {
            $(this).scrollTo({
                target: $($(this).data("target")),
                scroll: $(this).data("scroll"),
                offsettop: $(this).data("offsettop"),
                onscroll: $(this).data("onscroll"),
                scrollSpy: $(this).data("scrollspy")
            });
            $(this).removeAttr('data-scrollTo');
        });
    });
})(jQuery);

(function($) {
    $.fn.shifter = function(options) {
        var defaultOpt = {
            animationTime: 300,
            onChange: null,
            height: 200,
            width: 300,
            clickable: false,
            lazingload: true
        };

        var $this = $(this);

        var opt = $.extend({}, defaultOpt, options);
        var height = opt.height * 1;
        var timer = null;
        var $list = $this.find("ul");
        $list.wrap('<div class="wrap"></div>');
        var $wrap = $(this).find(".wrap");
        var $items = $list.find("li");
        var amount = $items.length;
        var innerW = 0;
        var shift = 0;
        var maxOffsetX = 0;
        var pagesize = 1;

        if (opt.lazingload) {
            $items.each(function(index, item) {
                var img = $(item).find('img[src]');
                img.data('src', img.attr("src"));
                img.removeAttr('src');
            });
        }

        var prevLink = $('<a href="javascript:;" class="prev"><i class="icon-angle-left"></i></a>');
        var nextLink = $('<a href="javascript:;" class="next"><i class="icon-angle-right"></i></a>');
        var _resize = function() {
            innerW = 0;
            $items.each(function(i, item) {
                innerW += $(item).outerWidth();
            });
            $list.width(innerW);
            pagesize = Math.ceil(innerW / $wrap.outerWidth());

            maxOffsetX = $wrap.prop('scrollWidth') - $wrap.width();
            if (maxOffsetX <= 0) {
                prevLink.css("visibility", "hidden");
                nextLink.css("visibility", "hidden");
            } else {
                prevLink.css("visibility", "visible");
                nextLink.css("visibility", "visible");
            }
        };
        var _markActive = function() {
            var list = [];
            var maxwidth = $wrap.outerWidth();
            $items.each(function(index, item) {
                var $item = $(item);
                $item.removeClass("active");
                var left = $item.position().left;
                var right = left + $item.outerWidth();
                if (left >= 0 && left <= maxwidth || right >= 0 && right <= maxwidth) {
                    if (opt.lazingload) {
                        $item.find("img").each(function(index, img) {
                            if ($(img).data("src")) {
                                $(img).attr("src", $(img).data("src"));
                                $(img).data("src", null);
                            }
                        });
                    }
                    list.push({
                        isFull: left >= 0 && right <= maxwidth,
                        element: $item
                    });
                }
            });
            if (list.length > 2) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].isFull) {
                        list[i].element.addClass("active");
                    }
                }
            } else if (list.length == 1) {
                list[0].element.addClass("active");
            } else if (list.length == 2) {
                var width1 = list[0].element.outerWidth() + list[0].element.position().left;
                var width2 = maxwidth - width1;
                if (width1 > width2) {
                    list[0].element.addClass("active");
                } else {
                    list[1].element.addClass("active");
                }
            }
        }
        var _scroll = function() {
            _markActive();
            if ($wrap.scrollLeft() == 0) {
                prevLink.hide();
                nextLink.show();
            } else if (($wrap.scrollLeft() - maxOffsetX) <= 3 && ($wrap.scrollLeft() - maxOffsetX) >= -3) {
                prevLink.show();
                nextLink.hide();
            } else {
                prevLink.show();
                nextLink.show();
            }
        }
        var _shift = function(index) {
            if ($.isInt(index)) {
                var item = $items.eq(index);
                var offset = ($wrap.outerWidth() - item.outerWidth()) / 2;
                var left = $wrap.scrollLeft() + $(item).position().left - offset;
                $wrap.stop().animate({
                    "scrollLeft": left
                }, opt.animationTime);
                return;
            } else {
                if (index) {
                    var begin = $wrap.scrollLeft();
                    var end = $wrap.outerWidth();
                    $items.each(function(j, item) {
                        var left = $(item).position().left;
                        var width = $(item).outerWidth();
                        if (left > 0 && left < end && (left + width) > end) {
                            $wrap.stop().animate({
                                "scrollLeft": begin + $(item).position().left
                            }, opt.animationTime);
                            return false;
                        }
                    });
                    return;
                } else {

                    var begin = $wrap.scrollLeft();
                    var end = $wrap.outerWidth();
                    $items.each(function(j, item) {
                        var left = $(item).position().left;
                        var width = $(item).outerWidth();
                        if (left <= 0 && (left + width) > 0) {
                            $wrap.stop().animate({
                                "scrollLeft": begin - end + ($(item).width() + $(item).position().left)
                            }, opt.animationTime);
                            return false;
                        }
                    });
                    return;
                }
            }
        }

        var _prev = function() {
            _shift(false);
        };
        var _next = function() {
            _shift(true);
        };

        var _go = function(index) {
            _shift(index);
        };

        var init = function() {
            var obj = {
                prev: function() {
                    _prev();
                },
                next: function() {
                    _next();
                },
                go: function(index) {
                    _go(index);
                }
            };
            $this.css("height", opt.height);
            $wrap.css("height", opt.height + 21);

            $this.append(prevLink);
            $this.append(nextLink);

            $items.each(function(index, item) {
                $(item).css({
                    width: opt.width,
                    height: opt.height
                });
                $(item).children().css({
                    width: opt.width,
                    height: opt.height,
                    display: 'block'
                });
                if (opt.clickable) {
                    var i = index + 1;
                    $(item).click(function() {
                        obj.go(i);
                    });
                }
            });
            prevLink.click(obj.prev);
            nextLink.click(obj.next);

            $(document).on("dom.resize", function() {
                _resize();
                _scroll();
            });

            $wrap.on("scroll", function() {
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(_scroll, 200);
            });
            _resize();
            _scroll();
            $this.attr('role', 'Shifter');
            $this.data("shifter", obj);
            return obj;
        }

        return init();
    };

    $(document).on("dom.load.shifter", function() {
        var inital = function() {
            $("[data-shifter]").each(function() {
                var $this = $(this);
                var opt = {
                    animationTime: $this.attr("data-time") * 1 || 300,
                    hideNav: $this.attr('data-hideNav'),
                    onChange: $this.attr('data-onChange'),
                    height: $this.attr('data-height') * 1 || 200,
                    width: $this.attr('data-width') * 1 || 300,
                    lazingload: $this.attr('data-lazingload') != "false"
                };
                $this.shifter(opt);
                $this.removeAttr('data-shifter');
            });
        };
        if ($("[data-shifter]").length) {
            inital();
        }
    });
})(jQuery);

//slider
(function($) {
    $.fn.slide = function(options) {
        var defaultOpt = {
            loop: true,
            index: 0,
            hideNav: false,
            onChange: null,
            lazingload: true
        };
        var opt = $.extend({}, defaultOpt, options);
        var $this = $(this);
        var $list = $this.find('.slider-list');
        var $item = $list.find('li');
        var length = $item.length;



        if (length > 1) {
            $item.each(function(index, item) {
                $(item).attr('index', index);
            });

            if (opt.lazingload) {
                $item.each(function(index, li) {
                    if(index>=2){
                        var img = $(li).find('img[src]');
                        img.data('src', img.attr("src"));
                        img.removeAttr('src');
                    }
                });
            }

            var slide = function(index, animated) {
                var $list = $this.find('.slider-list');
                var firstItem = null;
                var secondItem = null;

                var currentItem = $list.find('li.active');
                if (!currentItem.length) {
                    currentItem = $list.find('li:first-child');
                }

                var nextItem = $this.find('li[index=\'' + index + '\']');

                if (index === opt.index) {
                    return;
                }


                var isReverse = index < opt.index ? ((opt.index + 1 - index) == length) : ((index + 1 - opt.index) !== length);
                //reverse
                if (isReverse) {
                    $list.prepend(nextItem);
                    $list.prepend(currentItem);
                    $list.css({
                        'right': '-' + $item.width() + 'px',
                        'left': 'auto'
                    });
                    if (animated == false) {
                        $list.css('right', 0);
                    } else {

                        $list.stop().animate({
                            'right': 0
                        });
                    }
                } else {
                    $list.prepend(currentItem);
                    $list.prepend(nextItem);
                    $list.css({
                        'left': '-' + $item.width() + 'px',
                        'right': 'auto'
                    });
                    if (animated == false) {
                        $list.css('left', 0);
                    } else {
                        $list.stop().animate({
                            'left': 0
                        });
                    }
                }
                if (opt.lazingload) {
                    currentItem.find("img").each(function(index, img) {
                        if ($(img).data("src")) {
                            $(img).attr("src", $(img).data("src"));
                            $(img).data("src", null);
                        }
                    });
                    nextItem.find("img").each(function(index, img) {
                        if ($(img).data("src")) {
                            $(img).attr("src", $(img).data("src"));
                            $(img).data("src", null);
                        }
                    });
                }

                opt.index = index;
                currentItem.removeClass('active');
                nextItem.addClass('active');
                if (opt.onChange) {
                    if ($.isFunction(opt.onChange)) {
                        opt.onChange(index);
                    } else {
                        $(document).trigger(opt.onChange, [index]);
                    }
                }
            };
            var obj = {
                setOption: function(key, value) {
                    opt[key] = value;
                },
                go: function(index, animated) {
                    slide(index, animated);
                },
                next: function() {
                    if (opt.index >= length - 1) {
                        if (opt.loop) {
                            slide(0);
                        }
                    } else {
                        slide(opt.index + 1);
                    }
                },
                prev: function() {
                    if (opt.index == 0) {
                        if (opt.loop) {
                            slide(length - 1);
                        }
                    } else {
                        slide(opt.index - 1);
                    }
                }
            };
            $(document).on("dom.keydown", function(ctx, e) {
                var tagName = $(":focus").length > 0 ? $(":focus")[0].tagName : '';
                if (tagName !== "INPUT" && tagName !== "TEXTAREA") {
                    // e.stopPropagation();
                    // e.preventDefault();

                    if (e.keyCode == '37') {
                        obj.prev();
                    }
                    if (e.keyCode == '39') {
                        obj.next();
                    }
                }
            });
            $this.on('swipeleft', obj.next);
            $this.on('swiperight', obj.prev);
            if (!opt.hideNav) {
                var prevLink = $('<a href="javascript:void(0)" class="prev"><i class="icon-angle-left"></i></a>').click(obj.prev);
                var nextLink = $('<a href="javascript:void(0)" class="next"><i class="icon-angle-right"></i></a>').click(obj.next);
                $this.append(prevLink);
                $this.append(nextLink);
            }

            $this.data('slider', obj);
            $this.attr('role','Slider');
            return obj;
        } else {
            return null;
        }
    };

    $(document).on('dom.load.slider', function() {
        var inital = function() {
            $('[data-slider]').each(function() {
                var $this = $(this);
                var opt = {
                    loop: $this.attr('data-loop'),
                    index: $this.attr('data-index'),
                    hideNav: $this.attr('data-hideNav'),
                    onChange: $this.attr('data-onChange')
                };
                $this.slide(opt);
                $this.removeAttr('data-slider');
            });
        };
        if ($('[data-slider]').length) {
            inital();
        }

    });
})(jQuery);

(function($) {
    $.fn.stick = function(option) {
        var defaultOpt = {
            offset: 50,
        }
        var $this = $(this);
        var shouldwrap = $this.css("position") === "static" || $this.css("position") === "relative";
        var height = $this.outerHeight();
        if (shouldwrap) {
            var $warp = $('<div></div>').height(height)
            $this.wrap($warp);
        }
        var opt = $.extend(option, defaultOpt);
        var top = $this.offset().top;
        var _stick = function() {
            if ($(document).scrollTop() > (top - opt.offset)) {
                $this.addClass('stick');
                $this.css("top", opt.offset)
            } else {
                $this.removeClass('stick');
            }
        }

        $(window).on("scroll", _stick);
        _stick();
        $this.attr('role','Stick');
    };
    $(document).on("dom.load", function() {
        $("[data-stick]").each(function(index, item) {
            $(item).stick({
                offset: $(item).attr("data-offset") * 1 || 50
            });
            $(item).removeAttr('data-stick');
        });
    });
})(jQuery);

//form submit
(function($) {
    $.fn.submitForm = function(options) {
        var $this = $(this);
        var defaultOpt = {
            target: "",
            lock: 1,
        };
        var opt = $.extend({}, defaultOpt, options);
        var obj = {
            send: function() {
                if ($this.is("[disabled]")) {
                    return false;
                }
                var params = {
                    type: opt.type,
                    beforeSend: opt.beforeSend,
                    success: opt.success,
                    error: opt.error,
                    dataType: opt.dataType,
                    trigger: $this,
                    lock: opt.lock
                };
                var methodName = opt.methodName;

                if (opt.target) {
                    var $target = $(opt.target);
                    if ($target.isValid()) {
                        params.data = $target.formValue();
                    } else {
                        return false;
                    }
                }

                if ($.isFunction(commonService[methodName])) {
                    commonService[methodName](params);
                }
            },
            setOption: function(key, value) {
                opt[key] = value;
            },
            setOptions: function(options) {
                $.extend(opt, options);
            }
        };

        $this.click(obj.send);
        $this.data("submit", obj);
        $this.attr('role','SubmitForm');
        return obj;
    };
    $(document).on('dom.load.submit', function() {
        $('[data-submit]').each(function() {
            var $this = $(this);
            if ($this.attr("data-target")) {
                var $form = $($this.attr("data-target"));
                $form.on('keyup', function(e) {
                    if (e.keyCode === 13) {
                        //when focus on textarea will not auto submit
                        if ($("textarea:focus").length === 0) {
                            $this.click();
                        }
                    }
                });
            }
        });
    });
    $(document).on('click.submit', '[data-submit]', function() {
        var $this =$(this);
        var methodName = $this.attr('data-submit');
        if (methodName) {
            var opt = {
                methodName: methodName,
                target: $this.attr('data-target'),
                type: $this.attr('data-type'),
                dataType: $this.attr('data-dataType'),
                beforeSend: $this.attr('data-beforeSend'),
                success: $this.attr('data-success'),
                error: $this.attr('data-error'),
                lock: $this.attr('data-lock'),
            };

            if (!opt.success) {
                opt.success = feedback(methodName);
            }

            var obj = $this.submitForm(opt);
            $this.removeAttr('data-submit');

            if (obj) {
                obj.send();
            }
        }
    });
})(jQuery);

//tab
(function($) {
    $.fn.tabs = function() {
        var $this = $(this);

        function toggle($item) {
            //hide all
            var item = $this.find('[data-tab]');
            item.removeClass("active");
            item.each(function(index,item) {
                var target = $(item).attr('data-target');
                $(target).hide();
            });
            //show click one
            var target = $item.attr('data-target');
            $item.addClass('active');
            $(target).show();
        }

        $this.find('[data-tab]').each(function(index, item) {
            var $item = $(item);
            if ($($item.attr("data-target")).length > 0) {

                if ($item.hasClass('active')) {
                    toggle($item);
                }
                $item.click(function() {
                    toggle($(this));
                });
            } else {
                $item.hide();
            }
        });
        $this.attr('role','Tabs');
    };

    $(document).on('dom.load.tabs', function() {
        $('[data-tabs]').each(function(index,item) {
            $(item).tabs();
            $(item).removeAttr('data-tabs');
        });
    });
})(jQuery);

//tip
(function($) {
    $.fn.tip = function(option) {
        var opt = $.extend({}, option);
        var type = option.type || 'normal';
        delete option.type;

        var config = {
            normal: {
                placement: option.position || 'top',
                trigger: 'hover focus'
            },
            error: {
                placement: option.position || 'bottom',
                template: '<div class="tooltip error" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                trigger: 'manual',
                html: true,
            },
            warning: {
                placement: option.position || 'top',
                template: '<div class="tooltip warning" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                trigger: 'manual',
                html: true,
            },
            info: {
                placement: option.position || 'top',
                template: '<div class="tooltip info" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                trigger: 'manual',
                html: true,
            },
        };
        opt = $.extend(opt, config[type]);

        $(this).tooltip(opt);
    };
    var inital = function(type) {
        $("[data-tip]").each(function() {
            $(this).tip({
                type: $(this).attr('data-tip'),
                position: $(this).attr('data-position')
            });
            $(this).removeAttr("data-tip");
            $(this).attr('role', 'Tip');
        });
    };
    $(document).on('dom.load', function() {
        inital();
    });
})(jQuery);
//popover
(function($) {
    $.fn.tippopover = function(option){
        var $this = $(this);
        var defaultOption ={
            title:'',
            content:'',
            html: true,
            placement:'bottom'
        };
        var opt = $.extend({},defaultOption,option);
        var popover = $this.popover(opt);

        var namespace = {
            show: function() {
                $this.popover('show');
            },
            hide: function() {
                $this.popover('hide');
            },
            toggle: function() {
                $this.popover('toggle');
            }
        };

        $this.data('popover', namespace);
        $this.on('shown.bs.popover', function() {
            $(document).one('mouseup.popover', function() {
                setTimeout(function() {
                    $this.popover('hide');
                }, 100);
            });
        });
        $this.attr('role','Popover');
        return namespace;
    }

    $(document).on('click.popover', "[data-popover]", function() {
        var $this =$(this);
        var tippopover = $this.tippopover({
            title: $this.attr('data-popover'),
             content: $this.attr('data-content'),
             placement: $this.attr('data-placement')
        });
        tippopover.show();
        $this.removeAttr("data-popover");
    });
})(jQuery);

//validate for form submit
(function($) {
    //customer validate
    var customValidate = {
        max: function($element) {
            var value = $element.val();
            var max = $element.attr("data-max");
            var a = $.isNumeric(value) ? value : Date.parse(value);
            var b = $.isNumeric(max) ? max : Date.parse(max);
            return (a - b) <= 0;
        },
        less: function($element) {
            var value = $element.val();
            var less = $element.attr("data-less");
            var a = $.isNumeric(value) ? value : Date.parse(value);
            var b = $.isNumeric(less) ? less : Date.parse(less);
            return (a - b) < 0;
        },
        min: function($element) {
            var value = $element.val();
            var min = $element.attr("data-min");
            var a = $.isNumeric(value) ? value : Date.parse(value);
            var b = $.isNumeric(min) ? min : Date.parse(min);
            return (a - b) >= 0;
        },
        greater: function($element) {
            var value = $element.val();
            var greater = $element.attr("data-greater");
            var a = $.isNumeric(value) ? value : Date.parse(value);
            var b = $.isNumeric(greater) ? greater : Date.parse(greater);
            return (a - b) > 0;
        }
    };
    var _showValidate = function($element, message) {
        $element.closest(".input").removeClass("has-success");
        $element.closest(".input").addClass("has-error");
        if ($element.is('[id]')) {
            $('[for=' + $element.attr('id') + ']').addClass("error-text");
        }
        $element.attr('title', message);
        $element.tooltip('destroy');
        $element.tip({
             type:'error'
        });
        $element.tooltip('show');
    };
    var _passValidate = function($element, isRequried) {
        $element.closest(".input").removeClass("has-error");
        $element.tooltip('hide');
        if ($element.is('[id]')) {
            $('[for=' + $element.attr('id') + ']').removeClass("error-text");
        }
        if (isRequried) {
            $element.closest(".input").addClass("has-success");
        } else if ($element.val()) {
            $element.closest(".input").addClass("has-success");
        } else {
            $element.closest(".input").removeClass("has-success");
        }
    };
    var _validate = function($element) {
        var type = $element.attr("data-validate") ? $element.attr("data-validate").split(',') : [];
        var name = $element.attr("name");
        var value = $.trim($element.val());
        var isRequried = type[0] === "required";
        var dataMessage = $element.attr("data-errortext");
        var message = "";
        for (var i = 0; i < type.length; i++) {
            switch (type[i]) {
                case "required":
                    if (!value && value === "") {
                        switch (name) {
                            case "name":
                            case "firstname":
                            case "fullname":
                                name = "Name";
                                break;
                            case "phoneNum":
                                name = "Phone Number";
                                break;
                            case "email":
                                name = "Email";
                                break;
                            case "comment":
                                name = "Comment";
                                break;
                            case "agentName":
                                name = "Agent name";
                                break;
                            case "zipcodecityname":
                                name = "Zipcode or City name";
                                break;
                            case "username":
                                name = "Email (Movoto ID)";
                                break;
                            case "password":
                                name = "Password";
                                break;
                            case "address":
                                name = "Address";
                                break;
                            case "zipcode":
                                name = "Zipcode";
                                break;
                            case "cityname":
                                name = "City name";
                                break;
                            case "first_name":
                                name = "Firstname";
                                break;
                            case "last_name":
                                name = "Lastname";
                                break;
                        }
                        message = name ? (name + " is required.") : "This is requried";
                        _showValidate($element, message);
                        return false;
                    }
                    break;
                case "email":
                    if (value && !$.isEmail(value)) {
                        message = dataMessage || "Please enter a valid email.";
                        _showValidate($element, message);
                        return false;
                    }
                    break;
                case "mutilemail":
                    if (value && !$.isEmails(value)) {
                        message = dataMessage || "Please enter valid emails";
                        _showValidate($element, message);
                        return false;
                    }
                    break;
                case "phone":
                    if (value && !$.isPhone(value)) {
                        message = dataMessage || "Please enter a valid Phone Number";
                        _showValidate($element, message);
                        return false;
                    }
                    break;
                case "zipcode":
                    if (value && !$.isZipCode(value)) {
                        message = dataMessage || "Please enter a valid zipcode";
                        _showValidate($element, message);
                        return false;
                    }
                    break;
                case "price":
                    if (value && !$.isPrice(value)) {
                        message = dataMessage || "Please enter a valid price";
                        _showValidate($element, message);
                        return false;
                    }
                    break;
                case "int":
                    if (value && !$.isInt(value)) {
                        message = dataMessage || "Only allowed integer number";
                        _showValidate($element, message);
                        return false;
                    }
                    break;
                case "float":
                    if (value && !$.isFloat(value)) {
                        message = dataMessage || "Only allowed floating number";
                        _showValidate($element, message);
                        return false;
                    }
                    break;
                default:
                    break;
            }
        }

        var key = $element.attr("data-customValidate");
        if (customValidate[key] && !customValidate[key]($element)) {
            message = $element.attr("data-errortext") || "Invalid value.";
            _showValidate($element, message);
            return false;
        }
        _passValidate($element, isRequried);
        return true;
    };
    $.extend({
        isNotEmpty: function(str) {
            if (str === '' || str === null || str === "undefined")
                return false;
            return true;
        },
        isEmail: function(str) {
            var reg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
            return reg.test(str);
        },
        isEmails: function(str) {
            var reg = /^[\.a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+(\s*,\s*[\.a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+)*$/;
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
    $.fn.extend({
        validate: function() {
            $(this).find("[data-validate]").each(function(index, item) {
                var validateText = $(item).attr("data-validate");
                if (validateText.indexOf('phone') >= 0) {
                    $(item).inputformat({
                        type: "phone"
                    });
                }
                $(item).change(function() {
                    _validate($(item));
                });
            });
        },
        formValue: function() {
            var $element = $(this);
            var obj = {};
            $element.find(":text").each(function(index, item) {
                var name = $(item).attr("name");
                if (name) {
                    obj[name] = $(item).prop("rawValue") || $(item).val();
                }
                if ($(item).attr('googleAutomcomplete')) {
                    var data = $(item).data('gautoComplete').getValue();
                    obj[$(item).attr('googleAutomcomplete')] = data ? data.value : null;
                }
            });
            $element.find(":password").each(function(index, item) {
                var name = $(item).attr("name");
                if (name) {
                    obj[name] = $(item).val();
                }
            });
            $element.find(":hidden").each(function(index, item) {
                var name = $(item).attr("name");
                if (name) {
                    obj[name] = $(item).val();
                }
            });
            $element.find("textarea").each(function(index, item) {
                var name = $(item).attr("name");
                if (name) {
                    obj[name] = $(item).val();
                }
            });
            $element.find("select").each(function(index, item) {
                var name = $(item).attr("name");
                if (name) {
                    obj[name] = $(item).val();
                }
            });
            $element.find(".checkbox").each(function(index, item) {
                if ($(item).data("type") == "single") {
                    var checkbox = $(item).find(":checkbox").eq(0);
                    if (checkbox.length) {

                        var name = checkbox.attr("name");
                        if (checkbox.is(":checked")) {
                            obj[name] = checkbox.attr("value") ? checkbox.attr("value") : true;
                        } else {
                            obj[name] = checkbox.attr("value") ? "" : false;
                        }
                    }
                } else {

                    var checkboxList = $(item).find(":checkbox:checked");
                    var name = checkboxList.attr("name");
                    if (name) {
                        obj[name] = $.map(checkboxList, function(item) {
                            return $(item).val();
                        });
                    }
                }
            });
            $element.find(".radio").each(function(index, item) {
                var radioItem = $(item).find(":radio:checked");
                var name = radioItem.attr("name");
                if (name) {
                    obj[name] = $(radioItem).val();
                }
            });
            return obj;
        },
        isValid: function() {
            var foucsElement = null;
            var $element = $(this);
            var isPassed = true;
            $element.find("[data-validate]").each(function(index, item) {
                if (!_validate($(item))) {
                    isPassed = false;
                    if (!foucsElement) {
                        foucsElement = $(item);
                    }
                }
            });
            if (foucsElement) {
                foucsElement.focus();
            }
            return isPassed;
        }
    });
    $(document).on("dom.load", function() {
        $("[data-form]").each(function(index, item) {
            $(item).validate();
            $(item).removeAttr("data-form");
        });
    });
})(jQuery);
