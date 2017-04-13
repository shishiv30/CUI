(function($) {
    $.fn.measurement = function(option) {
        var defaultOption = {
            data: [
                {marker: '<div class="pin">A</div>', value: 100,}, {
                    marker: '<div class="pin">B</div>',
                    value: 500,
                },
                {marker: '<div class="pin">C</div>', value: 450,}
            ],
            min: null,
            max: null,
            onclick: null
        };
        var opt = $.extend({}, defaultOption, option);
        var $this = $(this);
        var _render = function() {
            var $container = $('<div class="measurement"><div class="measurement-line"></div></div></div>');
            $.each(opt.data, function(index, item) {
                if (opt.min > item.value) {
                    opt.min = item.value;
                }
                if (opt.max < item.value) {
                    opt.max = item.value;
                }
            });
            var total = opt.max - opt.min;
            $.each(opt.data, function(index, item) {
                var position = (item.value - opt.min ) / total * 100;
                var $item = $('<div class="measurement-item">' + item.marker + '</div>');
                $item.css({left: position + '%'});
                $container.append($item);
            });
            var $min = $('<div class="measurement-min">' + opt.min + '</div>');
            $container.append($min);
            var $max = $('<div class="measurement-max">' + opt.max + '</div>');
            $container.append($max);
            return $container;
        };
        $this.append(_render());
    };
    $(document).on('dom.load.measurement', function() {
        $('[data-measurement]').each(function(index, item) {
            $(item).measurement($(item).data());
            $(item).removeAttr('data-measurement');
        });
    });
})(jQuery);