//seed code for create a plugin
//replace all of the "shifter" with the plugin name. (the plugin name should be same as the js file name);

(function ($) {
    var shifterConfig = {
        name: 'shifter',
        defaultOpt: {
            duration: 300,
            height: 250,
            width: 375,
            lazingload: 1,
            autoscroll: 0,
            onchange: null,
            index: 1,
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            var sign_isAuto = false;
            var lastScrollLeft = 0;
            var $list;
            var $wrap;
            var $items;
            var innerW = 0;
            var maxOffsetX = 0;
            var prevLink = $('<a href="javascript:;" class="prev"><i class="icon-angle-left"></i></a>');
            var nextLink = $('<a href="javascript:;" class="next"><i class="icon-angle-right"></i></a>');
            var ratio = opt.height / opt.width;
            var _getImageSize = function () {
                var maxHeight = $(window).height() - 100;
                var screenheight = opt.height > maxHeight ? maxHeight : opt.height;
                var screenwidth = $this.width() || $(window).width();
                var tmpWidth = screenwidth > opt.width ? opt.width : screenwidth;
                var tmpHeight = tmpWidth * ratio;
                tmpHeight = screenheight > tmpHeight ? tmpHeight : screenheight;
                return {
                    width: tmpWidth,
                    height: tmpHeight
                };
            };
            var _resize = function () {
                innerW = 0;
                var perIndex = opt.index;
                var sizeInfo = _getImageSize();
                $this.css('height', sizeInfo.height);
                $wrap.css('height', sizeInfo.height + 21);
                $items.each(function (i, item) {
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
            var _markActive = function () {
                var list = [];
                var maxwidth = $wrap.outerWidth();
                $items.each(function (index, item) {
                    var $item = $(item);
                    $item.removeClass('active');
                    var left = $item.position().left;
                    var right = left + $item.outerWidth();
                    if (left >= 0 && left <= maxwidth || right >= 0 && right <= maxwidth) {
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
            var _scroll = function () {
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
            var _shift = function (index, disableAnimation) {
                var left;
                var ismove = false;
                var duration = disableAnimation ? 0 : opt.duration;
                if ($.isInt(index)) {
                    if (index > $items.length) {
                        index = index % $items.length;
                        duration = 0;
                    }
                    var item = $items.eq(index - 1);
                    var offset = ($wrap.outerWidth() - item.outerWidth()) / 2;
                    left = $wrap.scrollLeft() + $(item).position().left - offset;
                    $this.addClass('shifter-moving');
                    $wrap.stop().animate({
                        'scrollLeft': left
                    }, duration, function () {
                        $this.removeClass('shifter-moving');
                    });
                    return index;
                } else {
                    var begin = $wrap.scrollLeft();
                    var end = $wrap.outerWidth();
                    var width;
                    if (index) {
                        $items.each(function (j, item) {
                            left = $(item).position().left;
                            width = $(item).outerWidth();
                            if (left >= 0 && (left + width) > end) {
                                ismove = true;
                                $this.addClass('shifter-moving');
                                $wrap.stop().animate({
                                    'scrollLeft': begin + left
                                }, duration, function () {
                                    $this.removeClass('shifter-moving');
                                });
                                return false;
                            }
                        });
                        return ismove;
                    } else {
                        $items.each(function (j, item) {
                            left = $(item).position().left;
                            width = $(item).outerWidth();
                            if (left < 0 && (left + width) >= 0) {
                                ismove = true;
                                $this.addClass('shifter-moving');
                                $wrap.stop().animate({
                                    'scrollLeft': begin - end + (left + width)
                                }, duration, function () {
                                    $this.removeClass('shifter-moving');
                                });
                                return false;
                            }
                        });
                        return ismove;
                    }
                }
            };
            var _prev = function () {
                return _shift(false);
            };
            var _next = function () {
                return _shift(true);
            };
            var _go = function (index) {
                return _shift(index);
            };
            var _option = function (option) {
                opt = $.extend(opt, option);
                return opt;
            };
            var _adjust = function () {
                var currentScrollLeft = $wrap.scrollLeft();
                var isScrollLeft = lastScrollLeft < currentScrollLeft;
                var offset = Math.abs(lastScrollLeft - currentScrollLeft);
                if (offset != 0) {
                    if (isScrollLeft) {
                        _next();
                    } else {
                        _prev();
                    }
                }
            };
            context = $.extend(context, {
                _prev: _prev,
                _next: _next,
                _go: _go,
                _option: _option,
                _adjust: _adjust
            });
            $list = $this.find('ul');
            $list.wrap('<div class="wrap"></div>');
            $wrap = $this.find('.wrap');
            $items = $list.find('li');
            $items.each(function (index, item) {
                $(item).attr('shift-index', index + 1);
            });
            if (opt.autoscroll && $.isNumeric(opt.autoscroll)) {
                setInterval(function () {
                    _next();
                    sign_isAuto = true;
                }, opt.autoscroll);
            }
            var sizeInfo = _getImageSize();
            $this.css('height', sizeInfo.height);
            $wrap.css('height', sizeInfo.height + 21);
            prevLink.click(function () {
                _prev();
                return false;
            });
            nextLink.click(function () {
                _next();
                return false;
            });
            $this.append(prevLink);
            $this.append(nextLink);
            $(document).on('dom.resize.shifter', function () {
                _resize();
                _scroll();
            });
            $wrap[0] && $wrap[0].addEventListener('scroll', $.throttle(_scroll,100),true);
            if ($.isMobile()) {
                $wrap.on('touchstart', function () {
                    lastScrollLeft = $wrap.scrollLeft();
                });
                $wrap.on('touchend', _adjust);
            }
            $(document).on('dom.keydown', function (ctx, e) {
                if (e.keyCode == '37') {
                    _prev();
                }
                if (e.keyCode == '39') {
                    _next();
                }
            });

            _resize();
            _scroll();
            if (opt.lazingload) {
                $wrap.loadimage();
            }
        },
        exports: {
            prev: function () {
                return this._prev();
            },
            next: function () {
                return this._next();
            },
            go: function (index) {
                return this._go(index);
            },
        },
        setOptionsBefore: null,
        setOptionsAfter: null,
        initBefore: null,
        initAfter: null,
        destroyBefore: null
    };
    $.CUI.plugin(shifterConfig);
    $(document).on('dom.load.shifter', function () {
        $('[data-shifter]').each(function (index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.removeAttr('data-shifter');
            $this.shifter(data);
            $this.attr('data-shifter-load', '');
        });
    });
})(jQuery);
