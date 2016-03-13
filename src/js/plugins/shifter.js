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
