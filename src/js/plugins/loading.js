//show loading (lock page & unlock page)
(function($) {
    // isShow flag for loading
    var isShow = false;
    $.extend({
        showLoading: function() {
            if (!isShow) {
                $('.loading-bg').stop().fadeIn(100);
                $('.loading-img').stop().show();
                isShow = true;
            }
        },
        hideLoading: function() {
            if (isShow) {
                $('.loading-bg').stop().fadeOut(100);
                $('.loading-img').stop().hide();
                isShow = false;
            }
        },
        showScreenLoading: function() {
            var $screenLoading = $('.screenLoading');
            if ($screenLoading.length === 0) {
                $('body').append($('<div class="screenLoading"></div>'));
            }
            $screenLoading.stop().fadeIn(500);
        },
        hideScreenLoading: function() {
            $('.screenLoading').stop().fadeOut(500);
        }
    });


    //var loading = $('mask div').loading();
    //loading.show();
    //loading.hide();
    // make sure the mask div do not have after styles

    $.fn.extend({
        'loading': function() {
            var $this = $(this);
            $this.css('position', 'relative');
            var cname = $this.attr('class');

            return {
                show: function() {
                    $this.attr('class', cname + ' loading');
                },
                hide: function() {
                    $this.attr('class', cname);
                }
            };
        }
    });

    $.extend({
        'loading': {
            showspinner: function(item) {
                $(item).addClass('loading spinner').css('position', 'relative');
            },
            show: function(item) {
                $(item).addClass('loading').css('position', 'relative');
            },
            hide: function(item) {
                $(item).removeClass('loading spinner');
            }
        }
    });

})(jQuery);