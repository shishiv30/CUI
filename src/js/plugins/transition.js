//seed code for create a plugin
//replace all of the "transition" with the plugin name. (the plugin name should be same as the js file name);
(function ($) {
    var transitionConfig = {
        name: 'transition',
        defaultOpt: {
            type: 'number',
            from: 0,
            to: 0,
            frame: 25,
            time: 2,
            fixed: 0,
            dateformat:'MMMM Do YYYY'
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            var start = null;
            var end = null;
            var step = null;
            var duration = null;
            var times = null;
            var format = null;
            var _freshNumber = context._freshNumber = function () {
                start = opt.from;
                end = opt.to;
                duration = Math.floor(1000 / opt.frame);
                times = opt.time * 1000/duration;
                step = ((end - start) / times);
            };
            var _freshDate = context._freshDate =function(){
                start =+new Date(opt.from);
                end  =+new Date(opt.to);
                duration = 1000 / opt.frame;
                times = opt.time * 1000/duration;
                step = ((end - start) / times);
            };
            var _fresh = context._fresh = function(){
                switch(opt.type){
                case 'number':
                    _freshNumber();
                    format = function(rawNumber){
                        return rawNumber.toFixed(opt.fixed);
                    };
                    break;
                case 'date':
                    _freshDate();
                    format = function(rawNumber){
                        var rawDate = new Date(rawNumber);
                        return rawDate.format(opt.dateformat);
                    };
                    break;
                }
                var interval = setInterval(function () {
                    var rawNumber = Math.min(start, end);
                    $this.text(format(rawNumber));
                    if(rawNumber >= end) {
                        clearInterval(interval);
                    } else {
                        start = rawNumber + step;
                    }
                }, duration);
            };
            _fresh();
        },
        exports: {
            fresh: function () {
                var opt = this.opt;
                opt.freshbefore && $.CUI.trigger(opt.freshbefore, this);
                this._fresh();
                opt.freshafter && $.CUI.trigger(opt.freshafter, this);
            }
        },
        setOptionsBefore: null,
        setOptionsAfter: null,
        initBefore: null,
        initAfter: null,
        destroyBefore: null,
    };
    $.CUI.plugin(transitionConfig);
    $(document).on('dom.load.transition', function () {
        $('[data-transition]').each(function (index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.removeAttr('data-transition');
            $this.onscroll({
                once: true,
                callback: function () {
                    $this.transition(data);
                    $this.attr('data-transition-load', '');
                }
            });
        });
    });
})(jQuery);
