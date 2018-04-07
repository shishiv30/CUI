//seed code for create a plugin
//replace all of the "ranger" with the plugin name. (the plugin name should be same as the js file name);
(function ($) {
    var rangerConfig = {
        name: 'ranger',
        defaultOpt: {
            max: 100,
            min: 0,
            step: 0,
            decimals: 0,
            connect: null,
            orientation: 'horizontal',
            start: null,
            range: null,
            changebefore: null,
            changeafter: null,
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            var $input = $this.find('input');
            var $target = context.$target = (opt.target ? $(opt.target) : null);
            if(!opt.connect) {
                opt.connect = [true];
                $input.each(function (index) {
                    opt.connect.push((index % 2 === 1));
                });
            }
            if(!opt.start) {
                opt.start = [];
                $input.each(function () {
                    opt.start.push($(this).val());
                });
            }
            var $ele = $('<div></div>');
            ($target || $this).append($ele);
            noUiSlider.create($ele[0], {
                start: opt.start,
                step: opt.step,
                connect: opt.connect,
                orientation: opt.orientation,
                range: opt.range || {
                    'min': opt.min,
                    'max': opt.max
                },
                format: {
                    'to': function (value) {
                        return value !== undefined && value.toFixed(opt.decimals);
                    },
                    'from': function (value) {
                        return value;
                    }
                }
            });
            context.range = $ele[0].noUiSlider;
            context._get = function () {
                return this.range.get();
            };
            context._set = function (values) {
                this.range.set(values);
                var result = this.range.get();
                if($.isNumeric(result)) {
                    result = [result];
                }
                $input.each(function (index) {
                    $(this).val(result[index]).trigger('input');
                });
                return result;
            };
            $input.on('change', function () {
                var values = [];
                $input.each(function () {
                    values.push($(this).val());
                });
                context._set(values);
            });
            context.range.on('update', function (e, t) {
                opt.changebefore && $.CUI.trigger(opt.changebefore, this, e, t);
                $input.each(function (index) {
                    $(this).val(e[index]).trigger('input');
                });
                opt.changeafter && $.CUI.trigger(opt.changeafter, this, e, t);
            });
        },
        exports: {
            get: this._get,
            set: this._set,
            range: this.range
        },
    };
    $.CUI.plugin(rangerConfig);
    $(document).on('dom.load.ranger', function () {
        $('[data-ranger]').each(function (index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.removeAttr('data-ranger');
            $this.ranger(data);
            $this.attr('data-ranger-load', '');
        });
    });
})(jQuery);
