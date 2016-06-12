//slider
(function ($) {
    $.fn.slide = function (options) {
        var defaultOpt = {
            loop: true,
            index: 0,
            onchange: null,
            lazingload: true,
            autoscroll: 0,
            height: 300,
        };
        var $this = $(this);
        var opt = $.extend({}, defaultOpt, options);
        var $list;
        var obj;
        var $items;
        var length;
        var sign_isAuto = false;
        var prevLink = $('<a href="javascript:void(0)" class="prev"><i class="icon-angle-left"></i></a>');
        var nextLink = $('<a href="javascript:void(0)" class="next"><i class="icon-angle-right"></i></a>');
        var _option = function (option) {
            opt = $.extend(opt, option);
            return opt;
        };
        var _slide = function (index, animated) {
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
                    'right': '-' + $items.width() + 'px',
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
                    'left': '-' + $items.width() + 'px',
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
                currentItem.find("img").each(function (index, img) {
                    if ($(img).data("src")) {
                        $(img).attr("src", $(img).data("src"));
                        $(img).data("src", null);
                    }
                });

                nextItem.find("img").each(function (index, img) {
                    if ($(img).data("src")) {
                        $(img).attr("src", $(img).data("src"));
                        $(img).data("src", null);
                    }
                });
            }

            opt.index = index;
            currentItem.removeClass('active');
            nextItem.addClass('active');
            if (opt.onchange) {
                if ($.isFunction(opt.onchange, sign_isAuto)) {
                    opt.onchange(index);
                } else {
                    $(document).trigger(opt.onchange, [index, sign_isAuto]);
                }
            }
        };
        var _init = function () {
            if (opt.onbefore) {
                if ($.isFunction(opt.onbefore)) {
                    opt.onbefore($this);
                } else {
                    $(document).trigger(opt.onbefore, [$this]);
                }
            }
            $this.css('height', opt.height);
            $list = $this.find('.slider-list');
            $items = $list.find('li');
            length = $items.length;
            $items.each(function (index, item) {
                $(item).attr('index', index);
                if (index >= 2 && opt.lazingload) {
                    var img = $(item).find('img[src]');
                    img.data('src', img.attr("src"));
                    img.attr('src', 'data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEAAAIALAAAAAABAAEAAAICVAEAOw==');
                    $(item).addClass('img-loading');
                    setTimeout(function () {
                        img.one('load', function () {
                            $(item).removeClass('img-loading');
                        });
                    }, 100);
                }
            });
            obj = {
                optyion: _option,
                go: function (index, animated) {
                    _slide(index, animated);
                },
                next: function () {
                    if (opt.index >= length - 1) {
                        if (opt.loop) {
                            _slide(0);
                        }
                    } else {
                        _slide(opt.index + 1);
                    }
                },
                prev: function () {
                    if (opt.index == 0) {
                        if (opt.loop) {
                            _slide(length - 1);
                        }
                    } else {
                        _slide(opt.index - 1);
                    }
                }
            };
            if (opt.autoscroll && $.isNumeric(opt.autoscroll)) {
                autoTimer = setInterval(function () {
                    obj.next();
                    sign_isAuto = true;
                }, opt.autoscroll * 1);
            }
            $this.on('swipeleft', obj.next);
            $this.on('swiperight', obj.prev);
            prevLink.click(function (e) {
                obj.prev();
                return false;
            });
            nextLink.click(function (e) {
                obj.next();
                return false;
            });
            $this.append(prevLink);
            $this.append(nextLink);
            $this.data('slider', obj);
            $this.attr('role', 'Slider');
            $(document).on("dom.keydown", function (ctx, e) {
                if (e.keyCode == '37') {
                    obj.prev();
                }
                if (e.keyCode == '39') {
                    obj.next();
                }
            });
            if (opt.onafter) {
                if ($.isFunction(opt.onafter)) {
                    opt.onafter($this);
                } else {
                    $(document).trigger(opt.onafter, [$this]);
                }
            }
            return obj;
        }
        return _init();
    };

    $(document).on('dom.load.slider', function () {
        $('[data-slider]').each(function () {
            var $this = $(this);
            $this.slide($this.data());
            $this.removeAttr('data-slider');
        });
    });
})(jQuery);
