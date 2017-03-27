(function($) {
    $.fn.shifter = function(options) {
        var defaultOpt = {
            duration: 300,
            height: 300,
            width: 425,
            clickable: true,
            lazingload: true,
            autoscroll: 0,
            onchange: null,
            onbefore: null,
            onafter: null,
            index: 1,
        };
        var $this = $(this);
        var obj;
        var sign_isAuto = false;
        var lastScrollLeft = 0;
        var opt = $.extend({}, defaultOpt, options);
        var timer = null;
        var $list;
        var $wrap;
        var $items;
        var innerW = 0;
        var maxOffsetX = 0;
        var prevLink = $('<a href="javascript:;" class="prev"><i class="icon-angle-left"></i></a>');
        var nextLink = $('<a href="javascript:;" class="next"><i class="icon-angle-right"></i></a>');
        var ratio = opt.height / opt.width;

        var _getImageSize = function() {
            var maxHeight = $(window).height() - 100;
            var screenheight = opt.height > maxHeight ? maxHeight : opt.height;
            var screenwidth = $this.width() || $(window).width();
            var tmpWidth = screenwidth > opt.width ? opt.width : screenwidth - 2;
            var tmpHeight = tmpWidth * ratio;
            tmpHeight = screenheight > tmpHeight ? tmpHeight : screenheight;
            return {
                width: tmpWidth,
                height: tmpHeight
            };
        };
        var _resize = function() {
            innerW = 0;
            var perIndex = opt.index;
            var sizeInfo = _getImageSize();
            $this.css('height', sizeInfo.height);
            $wrap.css('height', sizeInfo.height + 21);
            $items.each(function(i, item) {
                $(item).css({
                    width: sizeInfo.width,
                    height: sizeInfo.height
                });
                $(item).children().css({
                    width: sizeInfo.width,
                    height: sizeInfo.height,
                });
                innerW += $(item).outerWidth();
            });
            $list.width(innerW);
            _shift(perIndex, true);
        };
        var _markActive = function() {
            var list = [];
            var maxwidth = $wrap.outerWidth();
            $items.each(function(index, item) {
                var $item = $(item);
                $item.removeClass('active');
                var left = $item.position().left;
                var right = left + $item.outerWidth();
                if (left >= 0 && left <= maxwidth || right >= 0 && right <= maxwidth) {
                    if (opt.lazingload) {
                        $item.find('img').each(function(index, img) {
                            if ($(img).data('src')) {
                                $(img).attr('src', $(img).data('src'));
                                $(img).data('src', null);
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
                        list[i].element.addClass('active');
                    }
                }
            } else if (list.length == 1) {
                list[0].element.addClass('active');
            } else if (list.length == 2) {
                var width1 = list[0].element.outerWidth() + list[0].element.position().left;
                var width2 = maxwidth - width1;
                if (width1 > width2) {
                    list[0].element.addClass('active');
                } else {
                    list[1].element.addClass('active');
                }
            }
            if (opt.onchange && lastScrollLeft !== $wrap.scrollLeft()) {
                var isNext = lastScrollLeft < $wrap.scrollLeft();
                if ($.isFunction(opt.onchange)) {
                    opt.onchange($list.find('.active'), sign_isAuto, isNext);
                } else {
                    $(document).trigger(opt.onchange, [$list.find('.active'), sign_isAuto, isNext]);
                }
                lastScrollLeft = $wrap.scrollLeft();
                sign_isAuto = false;
            }
            opt.index = $list.find('.active').attr('shift-index');
        };
        var _scroll = function() {
            _markActive();
            maxOffsetX = $wrap.prop('scrollWidth') - $wrap.width();
            if ($wrap.scrollLeft() <= 0) {
                prevLink.addClass('disable');
                nextLink.removeClass('disable');
            } else if (($wrap.scrollLeft() - maxOffsetX) <= 3 && ($wrap.scrollLeft() - maxOffsetX) >= -3) {
                prevLink.removeClass('disable');
                nextLink.addClass('disable');
            } else {
                prevLink.removeClass('disable');
                nextLink.removeClass('disable');
            }
        };
        var _shift = function(index, disableAnimation) {
            var left;
            var ismove = false;
            var timer = disableAnimation ? 0 : opt.duration;
            if ($.isInt(index)) {
                var item = $items.eq(index - 1);
                var offset = ($wrap.outerWidth() - item.outerWidth()) / 2;
                left = $wrap.scrollLeft() + $(item).position().left - offset;
                $wrap.stop().animate({
                    'scrollLeft': left
                }, timer);
                return index;
            } else {
                var begin = $wrap.scrollLeft();
                var end = $wrap.outerWidth();
                var width;
                if (index) {
                    $items.each(function(j, item) {
                        left = $(item).position().left;
                        width = $(item).outerWidth();
                        if (left > 0 && left < end && (left + width) > end) {
                            ismove = true;
                            $wrap.stop().animate({
                                'scrollLeft': begin + $(item).position().left
                            }, timer);
                            return false;
                        }
                    });
                    return ismove;
                } else {
                    $items.each(function(j, item) {
                        left = $(item).position().left;
                        width = $(item).outerWidth();
                        if (left <= 0 && (left + width) > 0) {
                            $wrap.stop().animate({
                                'scrollLeft': begin - end + ($(item).width() + $(item).position().left)
                            }, timer);
                            return true;
                        }
                    });
                    return ismove;
                }
            }
        };
        var _prev = function() {
            return _shift(false);
        };
        var _next = function() {
            return _shift(true);
        };
        var _go = function(index) {
            return _shift(index);
        };
        var _option = function(option) {
            opt = $.extend(opt, option);
            return opt;
        };
        var _init = function() {
            obj = {
                prev: function() {
                    return _prev();
                },
                next: function() {
                    return _next();
                },
                go: function(index) {
                    return _go(index);
                },
                option: _option
            };
            if (opt.onbefore) {
                if ($.isFunction(opt.onbefore)) {
                    opt.onbefore($this);
                } else {
                    $(document).trigger(opt.onbefore, [$this]);
                }
            }
            $list = $this.find('ul');
            $list.wrap('<div class="wrap"></div>');
            $wrap = $this.find('.wrap');
            $items = $list.find('li');
            $items.each(function(index, item) {
                $(item).attr('shift-index', index + 1);
                if (opt.clickable) {
                    var i = index + 2;
                    $(item).click(function() {
                        obj.go(i);
                    });
                }
                if (opt.lazingload) {
                    var img = $(item).find('img[src]');
                    img.data('src', img.attr('src'));
                    img.attr('src', 'data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEAAAIALAAAAAABAAEAAAICVAEAOw==');
                    $(item).addClass('img-loading');
                    img.on('load', function() {
                        if (img.data('src') == null) {
                            $(item).removeClass('img-loading');
                        } else {
                            $(item).addClass('img-loading');
                        }
                    });
                }
            });
            if (opt.autoscroll && $.isNumeric(opt.autoscroll)) {
                setInterval(function() {
                    obj.next();
                    sign_isAuto = true;
                }, opt.autoscroll);
            }
            var sizeInfo = _getImageSize();
            $this.css('height', sizeInfo.height);
            $wrap.css('height', sizeInfo.height + 21);
            prevLink.click(function() {
                obj.prev();
                return false;
            });
            nextLink.click(function() {
                obj.next();
                return false;
            });
            $this.append(prevLink);
            $this.append(nextLink);
            if ($.isMobile()) {
                $list.on('swipeleft', obj.next);
                $list.on('swiperight', obj.prev);
            }
            $(document).on('dom.resize.shifter', function() {
                _resize();
                _scroll();
            });
            $wrap.on('scroll', function() {
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(_scroll, 500);
            });
            $(document).on('dom.keydown', function(ctx, e) {
                if (e.keyCode == '37') {
                    obj.prev();
                }
                if (e.keyCode == '39') {
                    obj.next();
                }
            });
            _resize();
            _scroll();
            $this.data('shifter', obj);
            $this.attr('role', 'Shifter');
            if (opt.onafter) {
                if ($.isFunction(opt.onafter)) {
                    opt.onchange($this);
                } else {
                    $(document).trigger(opt.onafter, [$this]);
                }
            }
            return obj;
        };
        return _init();
    };

    $(document).on('dom.load.shifter', function() {
        $('[data-shifter]').each(function() {
            var $this = $(this);
            $this.shifter($this.data());
            $this.removeAttr('data-shifter');
        });
    });
})(jQuery);
