//popover
(function($) {
    $.fn.tippopover = function(option){
        var $this = $(this);
        var defaultOption ={
            title:'',
            content:'',
            html: true,
            placement:'bottom'
        };
        var opt = $.extend({},defaultOption,option);
        var popover = $this.popover(opt);

        var namespace = {
            show: function() {
                $this.popover('show');
            },
            hide: function() {
                $this.popover('hide');
            },
            toggle: function() {
                $this.popover('toggle');
            }
        };

        $this.data('popover', namespace);
        $this.on('shown.bs.popover', function() {
            $(document).one('mouseup.popover', function() {
                setTimeout(function() {
                    $this.popover('hide');
                }, 100);
            });
        });
        $this.attr('role','Popover');
        return namespace;
    }

    $(document).on('click.popover', "[data-popover]", function() {
        var $this =$(this);
        var tippopover = $this.tippopover({
            title: $this.attr('data-popover'),
             content: $this.attr('data-content'),
             placement: $this.attr('data-placement')
        });
        tippopover.show();
        $this.removeAttr("data-popover");
    });
})(jQuery);
