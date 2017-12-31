//dialog plugin
(function($) {
    var dialogConfig = {
        name: 'dialog',
        defaultOpt: {
            autoclose: true,
            cache: false,
            theme: 'default',
            id: null,
            trigger: null,
            showbefore: null,
            showafter: null,
            hidebefore: null,
            hideafter: null,
            html: null
        },
        initBefore: null,
        init: function(context) {
            var opt = context.opt;
            opt.id = 'dialog' + new Date();
            var $this = context.$element;
            var $dialog = $('<div class="dialog dialog-' + opt.theme + '" tabIndex="-1"></div>');
            var $dialogCloseButton = $('<a class="dialog-title-close" dialog-close href="javascript:void(0);"><i class="icon-remove"></i></a>');
            var $dialogPanel = $('<div class="dialog-panel"></div>');
            var $dialogBody = $('<div class="dialog-body"></div>');
            var $dialogOverLay = $('<div class="dialog-overlay"></div>');
            var _reposition = context._reposition = function() {
                var height = $dialog.height() - $dialogPanel.outerHeight();
                if (height > 0) {
                    $dialogPanel.css({
                        marginTop: height / 2 + 'px'
                    });
                } else {
                    $dialogPanel.css({
                        marginTop: 5
                    });
                }
            };
            context._show = function() {
                if (opt.showbefore) {
                    if ($.isFunction(opt.showbefore)) {
                        opt.showbefore();
                    } else {
                        $(document).trigger(opt.showbefore, [opt.trigger]);
                    }
                }
                if (!opt.cache || !$dialogBody.html()) {
                    $dialogBody.html($this.html());
                    _addCloseButton();
                }
                $(document).trigger('dom.load');
                $('html').addClass('model-dialog');
                $dialog.show();
                setTimeout(function() {
                    $dialog.addClass('dialog-active');
                    _reposition();
                    opt.showafter&&  $.CUI.addEvent(opt.showafter, context);
                }, 50);
            };
            var _hide = context._hide = function() {
                if ($dialog.hasClass('dialog-active')) {
                    if (opt.hidebefore) {
                        if ($.isFunction(opt.hidebefore)) {
                            opt.hidebefore();
                        } else {
                            $(document).trigger(opt.hidebefore, [opt.trigger]);
                        }
                    }
                    $dialog.removeClass('dialog-active');
                    $dialogPanel.css({marginTop: '0'});
                    setTimeout(function() {
                        $dialog.hide();
                        $('html').removeClass('model-dialog');
                        if (opt.hideafter) {
                            if ($.isFunction(opt.hideafter)) {
                                opt.hideafter();
                            } else {
                                $(document).trigger(opt.hideafter, [opt.trigger]);
                            }
                        }
                    }, 500);
                }
            };
            var _addCloseButton = function() {
                if ($dialogBody && $dialogBody.find('.dialog-title') && $dialogBody.find('.dialog-title').length) {
                    $dialogBody.find('.dialog-title').append($dialogCloseButton);
                }
                $dialogBody.on('click', '[dialog-close]', function() {
                    _hide();
                });
            };

            var _init = function() {
                $dialogPanel.append($dialogBody);
                $dialog.append($dialogPanel);
                $dialog.prepend($dialogOverLay);
                $('html').append($dialog);
                if (opt.theme == 'dropdown') {
                    $dialogBody.on('click', 'a', function() {
                        setTimeout(function() {
                            _hide();
                        }, 10);
                    });
                }
                if (opt.autoclose) {
                    $dialogOverLay.click(_hide);
                }
            };
            _init();
        },
        exports: {
            show: function() {
                var opt = this.opt;
                $(document).trigger('dialog.hidden.except', [opt.id]);
                this._show();
            },
            hide: function() {
                this._hide();
            }

        },
        setOptionsBefore: null,
        setOptionsAfter: null,
        destroyBefore: null,
        initAfter: function(context) {
            var opt = context.opt;
            $(document).on('dialog.hidden.except', function(e, id) {
                if (id != opt.id) {
                    context._hide();
                }
            });
            $(document).on('dom.resize', function() {
                context._reposition();
            });
        },
    };
    $.CUI.plugin(dialogConfig);
    $(document).on('dom.load.dialog', function() {
        $('[data-dialog]').each(function() {
            var $this = $(this);
            $this.click(function() {
                var $this = $(this);
                var data = $this.data();
                data.trigger = $this;
                var $target = $(data.target);
                $target.dialog(data).show();
                return false;
            });
            $this.removeAttr('data-dialog');
            $this.attr('data-dialog-load', '');
            $this.attr('role', 'Dialog');
        });
    });
})(jQuery);
