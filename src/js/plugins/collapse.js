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
