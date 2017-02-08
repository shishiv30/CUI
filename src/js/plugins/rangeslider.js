(function ($) {
    'use strict';
    var pluginName = 'rangeslider',
        pluginIdentifier = 0,
        constants = {
            orientation: {
                horizontal: {
                    dimension: 'width',
                    direction: 'left',
                    directionStyle: 'left',
                    coordinate: 'x'
                },
                vertical: {
                    dimension: 'height',
                    direction: 'top',
                    directionStyle: 'bottom',
                    coordinate: 'y'
                }
            }
        };

    /**
     * Check if a `element` is visible in the DOM
     *
     * @param  {Element}  element
     * @return {Boolean}
     */
    function isHidden(element) {
        return (
            element && (
                element.offsetWidth === 0 ||
                element.offsetHeight === 0 ||
                // Also Consider native `<details>` elements.
                element.open === false
            )
        );
    }

    /**
     * Get hidden parentNodes of an `element`
     *
     * @param  {Element} element
     * @return {[type]}
     */
    function getHiddenParentNodes(element) {
        var parents = [],
            node = element.parentNode;

        while (isHidden(node)) {
            parents.push(node);
            node = node.parentNode;
        }
        return parents;
    }

    /**
     * Returns dimensions for an element even if it is not visible in the DOM.
     *
     * @param  {Element} element
     * @param  {String}  key     (e.g. offsetWidth …)
     * @return {Number}
     */
    function getDimension(element, key) {
        var hiddenParentNodes = getHiddenParentNodes(element),
            hiddenParentNodesLength = hiddenParentNodes.length,
            inlineStyle = [],
            dimension = element[key];

        // Used for native `<details>` elements
        function toggleOpenProperty(element) {
            if (typeof element.open !== 'undefined') {
                element.open = (element.open) ? false : true;
            }
        }

        if (hiddenParentNodesLength) {
            for (var i = 0; i < hiddenParentNodesLength; i++) {

                // Cache style attribute to restore it later.
                inlineStyle[i] = hiddenParentNodes[i].style.cssText;

                // visually hide
                if (hiddenParentNodes[i].style.setProperty) {
                    hiddenParentNodes[i].style.setProperty('display', 'block', 'important');
                } else {
                    hiddenParentNodes[i].style.cssText += ';display: block !important';
                }
                hiddenParentNodes[i].style.height = '0';
                hiddenParentNodes[i].style.overflow = 'hidden';
                hiddenParentNodes[i].style.visibility = 'hidden';
                toggleOpenProperty(hiddenParentNodes[i]);
            }

            // Update dimension
            dimension = element[key];

            for (var j = 0; j < hiddenParentNodesLength; j++) {

                // Restore the style attribute
                hiddenParentNodes[j].style.cssText = inlineStyle[j];
                toggleOpenProperty(hiddenParentNodes[j]);
            }
        }
        return dimension;
    }


    /**
     * Capitalize the first letter of string
     *
     * @param  {String} str
     * @return {String}
     */
    function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.substr(1);
    }

    /**
     * Plugin
     * @param {String} element
     * @param {Object} options
     */
    function Plugin(element, opt) {
        var $document = $(document);
        var $this = $(element);
        var $container = $this.closest(opt.container).length > 0 ? $this.closest(opt.container) : $this;
        var $watcher = $(opt.watcher);
        opt.orientation = opt.orientation;
        opt.oninit = opt.oninit;
        opt.onSlide = opt.onSlide;
        opt.onSlideEnd = opt.onSlideEnd;
        var DIMENSION = constants.orientation[opt.orientation].dimension;
        var DIRECTION = constants.orientation[opt.orientation].direction;
        var DIRECTION_STYLE = constants.orientation[opt.orientation].directionStyle;
        var COORDINATE = constants.orientation[opt.orientation].coordinate;

        var identifier = 'js-' + pluginName + '-' + (pluginIdentifier++);
        var startEvent = opt.startEvent.join('.' + identifier + ' ') + '.' + identifier;
        var moveEvent = opt.moveEvent.join('.' + identifier + ' ') + '.' + identifier;
        var endEvent = opt.endEvent.join('.' + identifier + ' ') + '.' + identifier;
        var _toFixed = (opt.step + '').replace('.', '').length - 1;
        var $bg = $('<div class="' + opt.bgClass + '" />');
        var $fill = $('<div class="' + opt.fillClass + '" />');
        var $handle = $('<div class="' + opt.handleClass + '" />');
        var $range = $('<div class="' + opt.rangeClass + ' ' + opt[opt.orientation + 'Class'] + '" id="' + identifier + '" />').insertAfter($container).prepend($bg, $fill, $handle);

        var handleDimension;
        var rangeDimension;
        var maxHandlePos;
        var grabPos;
        var position;

        var init = function () {
            update(false);

            if (opt.oninit && typeof opt.oninit === 'function') {
                opt.oninit();
            }
        };

        var update = function (triggerSlide) {
            handleDimension = getDimension($handle[0], 'offset' + ucfirst(DIMENSION));
            rangeDimension = getDimension($range[0], 'offset' + ucfirst(DIMENSION));
            maxHandlePos = rangeDimension - handleDimension;
            grabPos = handleDimension / 2;
            position = getPositionFromValue(opt.value);

            // Consider disabled state
            if ($this[0].disabled) {
                $range.addClass(opt.disabledClass);
            } else {
                $range.removeClass(opt.disabledClass);
            }

            setPosition(position, triggerSlide);
        };

        var handleDown = function (e) {
            $document.on(moveEvent, handleMove);
            $document.on(endEvent, handleEnd);

            // If we click on the handle don't set the new position
            if ((' ' + e.target.className + ' ').replace(/[\n\t]/g, ' ').indexOf(opt.handleClass) > -1) {
                return;
            }

            var pos = getRelativePosition(e),
                rangePos = $range[0].getBoundingClientRect()[DIRECTION],
                handlePos = getPositionFromNode($handle[0]) - rangePos,
                setPos = (opt.orientation === 'vertical') ? (maxHandlePos - (pos - grabPos)) : (pos - grabPos);

            setPosition(setPos);

            if (pos >= handlePos && pos < handlePos + handleDimension) {
                grabPos = pos - handlePos;
            }
        };

        var handleMove = function (e) {
            e.preventDefault();
            var pos = getRelativePosition(e);
            var setPos = (opt.orientation === 'vertical') ? (maxHandlePos - (pos - grabPos)) : (pos - grabPos);
            setPosition(setPos);
        };

        var handleEnd = function (e) {
            e.preventDefault();
            $document.off(moveEvent, handleMove);
            $document.off(endEvent, handleEnd);
            // Ok we're done fire the change event
            $this.trigger('change', {
                origin: identifier
            });

            if (opt.onSlideEnd && typeof opt.onSlideEnd === 'function') {
                opt.onSlideEnd(position, opt.value);
            }
        };

        var cap = function (pos, min, max) {
            if (pos < min) {
                return min;
            }
            if (pos > max) {
                return max;
            }
            return pos;
        };

        var setPosition = function (pos, triggerSlide, isInputFormat) {
            var value, newPos;

            if (triggerSlide === undefined) {
                triggerSlide = true;
            }

            // Snapping steps
            value = getValueFromPosition(cap(pos, 0, maxHandlePos));
            newPos = getPositionFromValue(value);

            // Update ui
            $fill[0].style[DIMENSION] = (newPos + grabPos) + 'px';
            $handle[0].style[DIRECTION_STYLE] = newPos + 'px';
            if (!isInputFormat) {
                setValue(value);
            }
            // Update globals
            position = newPos;
            opt.value = value;
            if (triggerSlide && opt.onSlide && typeof opt.onSlide === 'function') {
                opt.onSlide(newPos, value);
            }
        };

        // Returns element position relative to the parent
        var getPositionFromNode = function (node) {
            var i = 0;
            while (node !== null) {
                i += node.offsetLeft;
                node = node.offsetParent;
            }
            return i;
        };

        var getRelativePosition = function (e) {
            // Get the offset DIRECTION relative to the viewport
            var ucCoordinate = ucfirst(COORDINATE),
                rangePos = $range[0].getBoundingClientRect()[DIRECTION],
                pageCoordinate = 0;
            if (typeof e['page' + ucCoordinate] !== 'undefined') {
                pageCoordinate = e['client' + ucCoordinate];
            } else if (typeof e.originalEvent['client' + ucCoordinate] !== 'undefined') {
                pageCoordinate = e.originalEvent['client' + ucCoordinate];
            } else if (e.originalEvent.touches && e.originalEvent.touches[0] && typeof e.originalEvent.touches[0]['client' + ucCoordinate] !== 'undefined') {
                pageCoordinate = e.originalEvent.touches[0]['client' + ucCoordinate];
            } else if (e.currentPoint && typeof e.currentPoint[COORDINATE] !== 'undefined') {
                pageCoordinate = e.currentPoint[COORDINATE];
            }

            return pageCoordinate - rangePos;
        };

        var getPositionFromValue = function (value) {
            var percentage, pos;
            percentage = (value - opt.min) / (opt.max - opt.min);
            pos = (!Number.isNaN(percentage)) ? percentage * maxHandlePos : 0;
            return pos;
        };

        var getValueFromPosition = function (pos) {
            var percentage, value;
            percentage = ((pos) / (maxHandlePos || 1));
            value = opt.step * Math.round(percentage * (opt.max - opt.min) / opt.step) + opt.min;
            return Number((value).toFixed(_toFixed));
        };

        var setValue = function (value) {
            if (value === opt.value && $this[0].value !== '') {
                return;
            }
            // Set the new value and fire the `input` event
            $this.val(value)
            .trigger('input', {
                origin: identifier
            });
        };


        // Store context
        handleDown = $.proxy(handleDown, this);
        handleMove = $.proxy(handleMove, this);
        handleEnd = $.proxy(handleEnd, this);

        init();
        $document.on('dom.resize', function () {
            update(false);
        });

        $document.on(startEvent, '#' + identifier + ':not(.' + opt.disabledClass + ')', handleDown);

        var obj = {
            switch: function () {
                var isSlider;
                if ($container.is(':hidden')) {
                    $range.hide();
                    $container.show();
                    isSlider = false;
                } else {
                    $range.show();
                    $container.hide();
                    isSlider = true;
                }
                if (opt.onSwitch) {
                    if ($.isFunction(opt.onSwitch)) {
                        opt.onSwitch($this, isSlider);
                    } else {
                        $(document).trigger(opt.onSwitch, [$this, isSlider]);
                    }
                }
            }
        };
        // visually hide the input
        if (opt.autohide) {
            obj.switch();
        }
        if ($watcher.length) {
            $watcher.click(obj.switch);
        }

        // Listen to programmatic value changes
        $this.on('formatinput change.' + identifier, function (e, data) {
            var isFormatInput = false;
            if (e.type === 'formatinput') {
                isFormatInput = true;
            } else {
                if (data && data.origin === identifier) {
                    return;
                }
            }

            var $target = $(e.target);
            var value = $target.prop('rawValue') || $target.val(),
                pos = getPositionFromValue(value);
            setPosition(pos, true, isFormatInput);

            if (opt.onchange) {
                var $this = $(this);
                if ($.isFunction(opt.onchange)) {
                    opt.onchange($this, $this.prop('rawValue') || $this.val(), $watcher);
                } else {
                    $(document).trigger(opt.onchange, [$this, $this.prop('rawValue') || $this.val(), $watcher]);
                }
            }
        });
        return obj;
    }

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn.rangeslider = function (options) {
        var $this = $(this);
        var defaultOpt = {
            orientation: 'horizontal',
            rangeClass: 'rangeslider',
            disabledClass: 'rangeslider-disabled',
            horizontalClass: 'rangeslider-horizontal',
            verticalClass: 'rangeslider-vertical',
            bgClass: 'rangeslider-bg',
            fillClass: 'rangeslider-fill',
            handleClass: 'rangeslider-handle',
            startEvent: ['mousedown', 'touchstart', 'pointerdown'],
            moveEvent: ['mousemove', 'touchmove', 'pointermove'],
            endEvent: ['mouseup', 'touchend', 'pointerup'],
            maxlimit: 0,
            minlimit: 0,
            step: 1,
            onchange: '',
            oninit: '',
            autohide: true,
            container: '.input'
        };
        var opt = $.extend(defaultOpt, options);
        var obj = new Plugin($this, opt);
        $this.data('rangesilder', obj);
        return obj;
    };
    $(document).on('dom.load', function () {
        $('input[data-rangesilder]').each(function () {
            var $this = $(this);
            var data = $this.data();
            data.value = ($this.prop('rawValue') || $this.val()) * 1;
            $this.rangeslider(data);
            $this.removeAttr('data-rangesilder');
        });
    });

})(jQuery);
