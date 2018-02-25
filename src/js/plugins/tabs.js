//seed code for create a plugin
//replace all of the "tabs" with the plugin name. (the plugin name should be same as the js file name);
(function ($) {
    var tabsConfig = {
        name: 'tabs',
        defaultOpt: {},
        init: function (context) {
            var $this = context.$element;
            var $items = $this.find('[data-tab]');
            var _switchActiveTab = function () {
                $items.each(function (index, item) {
                    var $item = $(item);
                    var $target = $($item.attr('data-target')).hide();
                    if($item.hasClass('active')) {
                        $target.show();
                        //todo $(document).trigger('dom.load');
                    } else {
                        $target.hide();
                    }
                });
            };
            $items.each(function () {
                $(this).click(function () {
                    $items.removeClass('active');
                    $(this).addClass('active');
                    _switchActiveTab();
                });
            });
            _switchActiveTab();
        },
        exports: null,
        setOptionsBefore: null,
        setOptionsAfter: null,
        initBefore: null,
        initAfter: null,
        destroyBefore: null
    };
    $.CUI.plugin(tabsConfig);
    $(document).on('dom.load.tabs', function () {
        $('[data-tabs]').each(function (index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.removeAttr('data-tabs');
            $this.tabs(data);
            $this.attr('data-tabs-load', '');
            $this.attr('role', 'tabs');
        });
    });
})(jQuery);
