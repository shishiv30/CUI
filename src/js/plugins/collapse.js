//collapse
(function($) {
    $.fn.collapse = function(options) {
        var defaultOpt = {
            showtext: null,
            hidetext: null,
            once: false,
            isexpand: false,
        };
        var opt = $.extend({}, defaultOpt, options);
        var $this = $(this);
        var $target = $(opt.target);

        var _showtext = function() {
            if (opt.showtext) {
                if ($this.find('span').length > 0) {
                    $this.find('span').text(opt.showtext);
                } else {
                    $this.text(opt.showtext);
                }
            }
        };
        var _hidetext = function() {
            if (opt.hidetext) {
                if ($this.find('span').length > 0) {
                    $this.find('span').text(opt.hidetext);
                } else {
                    $this.text(opt.hidetext);
                }
            }
        };
        var _hide = function() {
            var height;
            if ($target.offset().top < $this.offset().top) {
                height = $target.height();
            }
            if (height) {
                height = $(document).scrollTop() - height;
                $(document).scrollTop(height);
            }
            $this.removeClass('shown');
            $target.hide();
        };
        var _show = function() {
            $this.addClass('shown');
            $target.show();
        };
        var _more = function() {
            $this.addClass('shown');
            $target.addClass('collapse-expand');
        };
        var _less = function() {
            var height;
            if ($target.offset().top < $this.offset().top) {
                height = $target.height();
            }
            $this.removeClass('shown');
            $target.removeClass('collapse-expand');

            if (height) {
                height = $(document).scrollTop() + $target.height() - height;
                $(document).scrollTop(height);
            }
        };
        var _resetForExpand = function() {
            if ($target.prop('scrollHeight') > $target.prop('offsetHeight')) {
                $this.css('visibility', 'visible');
            } else {
                $this.css('visibility', 'hidden');
            }
        };
        var _toggle;
        if (opt.isexpand) {
            _toggle = function() {
                if ($this.hasClass('shown')) {
                    _less();
                    _hidetext();
                } else {
                    _more();
                    _showtext();
                    if (opt.once) {
                        $this.hide();
                        return;
                    }
                }
            };
            $(document).on('dom.resize', _resetForExpand);
            _resetForExpand();
        } else {
            _toggle = function() {
                if ($this.hasClass('shown')) {
                    _hide();
                    _hidetext();
                } else {
                    _show();
                    _showtext();
                    if (opt.once) {
                        $this.hide();
                        return;
                    }
                }
            };
        }
        var obj = {
            toggle: _toggle
        };
        $this.click(obj.toggle);
        $this.data('collapse', obj);
        $this.attr('role', 'Collapse');
        return obj;
    };

    $(document).on('dom.load.collapse', function() {
        $('[data-collapse]').each(function(index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.collapse(data);
            $this.removeAttr('data-collapse');
        });
    });
})(jQuery);
