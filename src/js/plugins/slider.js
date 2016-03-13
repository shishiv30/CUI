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
