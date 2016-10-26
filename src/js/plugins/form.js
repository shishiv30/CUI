//validate for form submit
(function ($) {
    //customer validate
    var customValidate = {
        max: function ($element) {
            var value = $element.val();
            var max = $element.attr("data-max");
            var a = $.isNumeric(value) ? value : Date.parse(value);
            var b = $.isNumeric(max) ? max : Date.parse(max);
            return (a - b) <= 0;
        },
        less: function ($element) {
            var value = $element.val();
            var less = $element.attr("data-less");
            var a = $.isNumeric(value) ? value : Date.parse(value);
            var b = $.isNumeric(less) ? less : Date.parse(less);
            return (a - b) < 0;
        },
        min: function ($element) {
            var value = $element.val();
            var min = $element.attr("data-min");
            var a = $.isNumeric(value) ? value : Date.parse(value);
            var b = $.isNumeric(min) ? min : Date.parse(min);
            return (a - b) >= 0;
        },
        greater: function ($element) {
            var value = $element.val();
            var greater = $element.attr("data-greater");
            var a = $.isNumeric(value) ? value : Date.parse(value);
            var b = $.isNumeric(greater) ? greater : Date.parse(greater);
            return (a - b) > 0;
        }
    };
    var _showValidate = function ($element, message) {
        $element.closest(".input").removeClass("has-success");
        $element.closest(".input").addClass("has-error");
        if ($element.is('[id]')) {
            $('[for=' + $element.attr('id') + ']').addClass("error-text");
        }
        $element.attr('title', message);
        $element.tooltip('destroy');
        $element.tip({
            type: 'error'
        });
        $element.tooltip('show');
    };
    var _passValidate = function ($element, isRequried) {
        $element.closest(".input").removeClass("has-error");
        $element.tooltip('hide');
        if ($element.is('[id]')) {
            $('[for=' + $element.attr('id') + ']').removeClass("error-text");
        }
        if (isRequried) {
            $element.closest(".input").addClass("has-success");
        } else if ($element.val()) {
            $element.closest(".input").addClass("has-success");
        } else {
            $element.closest(".input").removeClass("has-success");
        }
    };
    var _validate = function ($element) {
        var type = $element.attr("data-validate") ? $element.attr("data-validate").split(',') : [];
        var name = $element.attr("name");
        var value = $.trim($element.val());
        var isRequried = type[0] === "required";
        var dataMessage = $element.attr("data-errortext");
        var message = "";
        for (var i = 0; i < type.length; i++) {
            switch (type[i]) {
                case "required":
                    if (!value && value === "") {
                        switch (name) {
                            case "name":
                            case "firstname":
                            case "fullname":
                                name = "Name";
                                break;
                            case "phoneNum":
                                name = "Phone Number";
                                break;
                            case "email":
                                name = "Email";
                                break;
                            case "comment":
                                name = "Comment";
                                break;
                            case "agentName":
                                name = "Agent name";
                                break;
                            case "zipcodecityname":
                                name = "Zipcode or City name";
                                break;
                            case "username":
                                name = "Email (Movoto ID)";
                                break;
                            case "password":
                                name = "Password";
                                break;
                            case "address":
                                name = "Address";
                                break;
                            case "zipcode":
                                name = "Zipcode";
                                break;
                            case "cityname":
                                name = "City name";
                                break;
                            case "first_name":
                                name = "Firstname";
                                break;
                            case "last_name":
                                name = "Lastname";
                                break;
                        }
                        message = name ? (name + " is required.") : "This is requried";
                        _showValidate($element, message);
                        return false;
                    }
                    break;
                case "email":
                    if (value && !$.isEmail(value)) {
                        message = dataMessage || "Please enter a valid email.";
                        _showValidate($element, message);
                        return false;
                    }
                    break;
                case "mutilemail":
                    if (value && !$.isEmails(value)) {
                        message = dataMessage || "Please enter valid emails";
                        _showValidate($element, message);
                        return false;
                    }
                    break;
                case "phone":
                    if (value && !$.isPhone(value)) {
                        message = dataMessage || "Please enter a valid Phone Number";
                        _showValidate($element, message);
                        return false;
                    }
                    break;
                case "zipcode":
                    if (value && !$.isZipCode(value)) {
                        message = dataMessage || "Please enter a valid zipcode";
                        _showValidate($element, message);
                        return false;
                    }
                    break;
                case "price":
                    if (value && !$.isPrice(value)) {
                        message = dataMessage || "Please enter a valid price";
                        _showValidate($element, message);
                        return false;
                    }
                    break;
                case "int":
                    if (value && !$.isInt(value)) {
                        message = dataMessage || "Only allowed integer number";
                        _showValidate($element, message);
                        return false;
                    }
                    break;
                case "float":
                    if (value && !$.isFloat(value)) {
                        message = dataMessage || "Only allowed floating number";
                        _showValidate($element, message);
                        return false;
                    }
                    break;
                default:
                    break;
            }
        }

        var key = $element.attr("data-customValidate");
        if (customValidate[key] && !customValidate[key]($element)) {
            message = $element.attr("data-errortext") || "Invalid value.";
            _showValidate($element, message);
            return false;
        }
        _passValidate($element, isRequried);
        return true;
    };
    $.extend({
        isNotEmpty: function (str) {
            return !(str === '' || str === null || str === "undefined");
        },
        isEmail: function (str) {
            var reg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
            return reg.test(str);
        },
        isEmails: function (str) {
            var reg = /^[\.a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+(\s*,\s*[\.a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+)*$/;
            return reg.test(str);
        },
        isFloat: function (str) {
            var reg = /^([-]){0,1}([0-9]){1,}([.]){0,1}([0-9]){0,}$/;
            return reg.test(str);
        },
        isInt: function (str) {
            var reg = /^-?\d+$/;
            return reg.test(str);
        },
        isPhone: function (str) {
            var reg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/im;
            return reg.test(str);
        },
        isZipCode: function (str) {
            var reg = /^([0-9]){5}$/;
            return reg.test(str);
        },
        isPrice: function (str) {
            var reg = /^(([$])?((([0-9]{1,3},)+([0-9]{3},)*[0-9]{3})|[0-9]+)(\.[0-9]+)?)$/;
            return reg.test(str);
        }
    });
    $.fn.extend({
        validate: function () {
            $(this).find("[data-validate]").each(function (index, item) {
                var validateText = $(item).attr("data-validate");
                if (validateText.indexOf('phone') >= 0) {
                    $(item).inputformat({
                        type: "phone"
                    });
                } else if (validateText.indexOf('price') >= 0) {
                    $(item).inputformat({
                        type: "price"
                    });
                } else if (validateText.indexOf('rate') >= 0) {
                    var fraction = parseInt($(item).attr("data-fraction"));
                    $(item).inputformat({
                        type: "rate",
                        fraction: fraction
                    });
                }
                $(item).change(function () {
                    _validate($(item));
                });
            });
        },
        formValue: function () {
            var $element = $(this);
            var obj = {};
            $element.find(":text").each(function (index, item) {
                var name = $(item).attr("name");
                if (name) {
                    obj[name] = $(item).prop("rawValue") || $(item).val();
                }
                if ($(item).attr('googleAutomcomplete')) {
                    var data = $(item).data('gautoComplete').getValue();
                    obj[$(item).attr('googleAutomcomplete')] = data ? data.value : null;
                }
            });
            $element.find(":password").each(function (index, item) {
                var name = $(item).attr("name");
                if (name) {
                    obj[name] = $(item).val();
                }
            });
            $element.find(":hidden").each(function (index, item) {
                var name = $(item).attr("name");
                if (name) {
                    obj[name] = $(item).val();
                }
            });
            $element.find("textarea").each(function (index, item) {
                var name = $(item).attr("name");
                if (name) {
                    obj[name] = $(item).val();
                }
            });
            $element.find("select").each(function (index, item) {
                var name = $(item).attr("name");
                if (name) {
                    obj[name] = $(item).val();
                }
            });
            $element.find(".checkbox").each(function (index, item) {
                var name;
                var checkbox;
                var checkboxList;
                if ($(item).data("type") == "single") {
                    checkbox = $(item).find(":checkbox").eq(0);
                    if (checkbox.length) {

                        name = checkbox.attr("name");
                        if (checkbox.is(":checked")) {
                            obj[name] = checkbox.attr("value") ? checkbox.attr("value") : true;
                        } else {
                            obj[name] = checkbox.attr("value") ? "" : false;
                        }
                    }
                } else {
                    checkboxList = $(item).find(":checkbox:checked");
                    name = checkboxList.attr("name");
                    if (name) {
                        obj[name] = $.map(checkboxList, function (item) {
                            return $(item).val();
                        });
                    }
                }
            });
            $element.find(".radio").each(function (index, item) {
                var radioItem = $(item).find(":radio:checked");
                var name = radioItem.attr("name");
                if (name) {
                    obj[name] = $(radioItem).val();
                }
            });
            return obj;
        },
        isValid: function () {
            var foucsElement = null;
            var $element = $(this);
            var isPassed = true;
            $element.find("[data-validate]").each(function (index, item) {
                if (!_validate($(item))) {
                    isPassed = false;
                    if (!foucsElement) {
                        foucsElement = $(item);
                    }
                }
            });
            if (foucsElement) {
                foucsElement.focus();
            }
            return isPassed;
        }
    });
    $(document).on("dom.load", function () {
        $("[data-form]").each(function (index, item) {
            $(item).validate();
            $(item).removeAttr("data-form");
        });
    });
    $.fn.textbox = function () {
        var $this = $(this);
        var $input = $this.find('input');
        $input.on('focusin', function () {
            $this.addClass('focus');
        });
        $input.on('focusout', function () {
            if (!$input.val()) {
                $this.removeClass('focus');
            }
        });
    }
    $(document).on('dom.load', function () {
        $("[data-textbox]").each(function (index, item) {
            $(item).textbox();
            $(item).attr('data-textbox-load', '');
            $(item).removeAttr("data-textbox")
        });
    })
})(jQuery);
