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