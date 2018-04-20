//seed code for create a plugin
//replace all of the "view" with the plugin name. (the plugin name should be same as the js file name);
(function ($) {
    var viewConfig = {
        name: 'view',
        defaultOpt: {
            direction: 'x',
            limitation: 0.5,
            onovertop: null,
            onoverbottom: null,
            onoverleft: null,
            onoverright: null,
            onpushtop: null,
            onpushbottom: null,
            onpushleft: null,
            onpushright: null,
            onchange:null,
            oninital:null,
        },
        init: function (context) {
            var opt = context.opt;
            var $this = context.$element;
            var $wrapper = $this.children('ul');
            var $slides = $wrapper.children('li');
            var prePos = 0;
            var currPos = 0;
            var info = null;
            context._getInfo = function(){
                return info;
            };
            context._updateInfo = function () {
                var outerHeight = $this.outerHeight();
                var outerWidth = $this.outerWidth();
                info = {
                    max: [$wrapper.outerWidth() - outerWidth, $wrapper.outerHeight() - outerHeight],
                    swidth: $slides.outerWidth(),
                    sheight: $slides.outerHeight(),
                    cWidth: outerWidth,
                    cHeight: outerHeight,
                    limitation: (opt.direction === 'x' ? outerWidth : outerHeight) * opt.limitation,
                    scroll: [0,0],
                };
                if(opt.direction === 'x') {
                    info.scroll = [prePos * -1, 0];
                    info.index =  Math.round(prePos*-1/info.swidth);
                } else {
                    info.index =  Math.round(prePos*-1/info.sheight);
                }
            };
            context._go = function (currPos, disableScroll) {
                if(disableScroll) {
                    $wrapper.addClass('is-dragging');
                }
                if(opt.direction === 'x') {
                    $wrapper.css({
                        transform: 'translateX(' + currPos + 'px)'
                    });
                } else {
                    $wrapper.css({
                        transform: 'translateY(' + currPos + 'px)'
                    });
                }
                if(disableScroll) {
                    $wrapper.removeClass('is-dragging');
                }
                prePos = currPos;
                context._updateInfo();
                if(opt.onchange){
                    if($.isFunction(opt.onchange)) {
                        opt.onchange(info);
                    } else if(opt.onchange) {
                        $(document).trigger(opt.onchange, [info]);
                    }
                }
                setTimeout(function () {
                    $(document).trigger('dom.scroll');
                }, 200);
            };
            context._geInfo = function () {
                return info;
            };
            $this.on('drag', function () {
                $wrapper.addClass('is-dragging');
                info || context._updateInfo();
            });
            var _outRange = function (isDragged) {
                var max = opt.direction === 'x' ? info.max[0] : info.max[1];
                var eventName = '';
                if(currPos > 0) {
                    if(isDragged) {
                        eventName = opt.direction === 'x' ? opt.onpushleft : opt.onpushtop;
                    } else {
                        eventName = opt.direction === 'x' ? opt.onoverleft : opt.onovertop;
                    }
                    if($.isFunction(eventName)) {
                        eventName(currPos, -currPos);
                    } else if(eventName) {
                        $(document).trigger(eventName, [currPos, currPos]);
                    }
                } else if(Math.abs(currPos) > max) {
                    if(isDragged) {
                        eventName = opt.direction === 'x' ? opt.onpushright : opt.onpushbottom;
                    } else {
                        eventName = opt.direction === 'x' ? opt.onoverright : opt.onoverbottom;
                    }
                    if($.isFunction(eventName)) {
                        eventName(currPos, Math.abs(currPos + max));
                    } else if(eventName) {
                        $(document).trigger(eventName, [currPos, Math.abs(currPos + max)]);
                    }
                }
            };
            var _limitation = function (dir) {
                var max = opt.direction === 'x' ? info.max[0] : info.max[1];
                if(opt.direction === 'x') {
                    if('left' === dir[0]) {
                        if(currPos > (info.limitation)) {
                            currPos = info.limitation;
                        }
                    } else {
                        if(Math.abs(currPos) > (info.limitation + max)) {
                            currPos = (info.limitation + max) * -1;
                        }
                    }
                } else {
                    if('up' === dir[1]) {
                        if(currPos > (info.limitation)) {
                            currPos = info.limitation;
                        }
                    } else {
                        if(Math.abs(currPos) > (info.limitation + max)) {
                            currPos = (info.limitation + max) * -1;
                        }
                    }
                }
            };
            $this.on('dragging', function (e, dir, dist) {
                // Create a callback to determine whether the user has tracked enough to move onto the next slide.
                if(opt.direction === 'x') {
                    currPos = ('left' === dir[0]) ? (prePos - dist[0]) : (prePos + dist[0]);
                    _limitation(dir);
                    $wrapper.css({
                        transform: ('translateX(' + currPos + 'px)')
                    });
                } else {
                    currPos = ('top' === dir[1]) ? (prePos - dist[1]) : (prePos + dist[1]);
                    _limitation(dir);
                    $wrapper.css({
                        transform: ('translateY(' + currPos + 'px)')
                    });
                }
                _outRange();
            });
            $this.on('dragged', function (e, dir, dist, time) {
                $wrapper.removeClass('is-dragging');
                var max = opt.direction === 'x' ? info.max[0] : info.max[1];
                _outRange(true);
                var width = info.swidth;
                var height = info.sheight;
                var distance = opt.direction === 'x' ? dist[0] : dist[1];
                if(currPos >= 0 || max <= 0) {
                    currPos = 0;
                } else if((max + currPos) <= 0) {
                    currPos = max * -1;
                } else if(Math.abs(distance) / time > 0.1) {
                    if(opt.direction === 'x') {
                        offset = currPos % width;
                        currPos = dir[0] === 'left' ? currPos - (width + offset) : currPos - offset;
                    } else {
                        offset = currPos % height;
                        currPos = dir[1] === 'up' ? currPos - offset : currPos - (height + offset);
                    }
                } else {
                    var offset;
                    if(opt.direction === 'x') {
                        offset = currPos % width;
                        currPos = Math.abs(offset) > width / 2 ? currPos - (width + offset) : currPos - offset;
                    } else {
                        offset = currPos % height;
                        currPos = Math.abs(offset) > height / 2 ? currPos - (height + offset) : currPos - offset;
                    }
                }
                context._go(currPos);
            });
            $(document).on('dom.resize', context._updateInfo);
            context._updateInfo();
            if(opt.oninital){
                if($.isFunction(opt.oninital)) {
                    opt.oninital(info);
                } else if(opt.oninital) {
                    $(document).trigger(opt.oninital, [info]);
                }
            }
        },
        exports: {
            updateInfo:function(){
                return this._updateInfo();
            },
            getInfo:function(){
                return this._getInfo();
            },
            go: function (currPos, disableScroll) {
                return this._go(currPos, disableScroll);
            }
        },
        setOptionsBefore: null,
        setOptionsAfter: null,
        initBefore: null,
        initAfter: null,
        destroyBefore: null
    };
    $.CUI.plugin(viewConfig);
    $(document).on('dom.load.view', function () {
        $('[data-view]').each(function (index, item) {
            var $this = $(item);
            var data = $this.data();
            $this.removeAttr('data-view');
            $this.view(data);
            $this.attr('data-view-load', '');
        });
    });
})(jQuery);
