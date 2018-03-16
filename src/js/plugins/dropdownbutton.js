//seed code for create a plugin
//replace all of the "dropdownbutton" with the plugin name. (the plugin name should be same as the js file name);

(function($) {
    var dropdownbuttonConfig = {
        name: 'dropdownbutton',
        defaultOpt: {},
        init: function(context) {
            var $this = context.$element;
            var $link = $this.children('a').eq(0);
            var $icon = $this.children('a').eq(1);
            var $list = $this.find('.dropdown-button-list');
            $this.on('click', function(e) {
                e.stopPropagation();
            });
            context._select = function($item) {
                if ($item.closest('.dropdown-button-list').length > 0) {
                    $link.appendTo($list);
                    $item.prependTo($this);
                    $link = $item;
                    $(document).trigger('click.dropdownbutton');
                }
            };
            context._close = function() {
                $list.hide();
            };
            context._open = function() {
                if ($list.is(':hidden')) {
                    $list.show();
                    $(document).one('click.dropdownbutton', context._close);
                }
            };
            $icon.on('click', context._open);
            $list.find('a').on('click', function() {
                context._select($(this));
            });
            $link.on('click', function() {
                context._select($(this));
            });
        },
        exports: {
            show: function() {
                this._open();
            },
            hide: function() {
                this._close();
            },
            select:function(item){
                this._select(item);
            }
        },
        setOptionsBefore: null,
        setOptionsAfter: null,
        initBefore: null,
        initAfter:null,
        destroyBefore: null
    };
    $.CUI.plugin(dropdownbuttonConfig);
    $(document).on('dom.load.dropdownbutton', function() {
        $('[data-dropdownbutton]').each(function(index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.removeAttr('data-dropdownbutton');
            $this.dropdownbutton(data);
            $this.attr('data-dropdownbutton-load', '');
        });
    });
})(jQuery);
