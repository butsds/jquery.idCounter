;(function($) {
    var pluginName = "idCounter",
        defaults = {

            defaultValue    : 1,
            max             : 10,
            min             : 1,
            step            : 1,
            cost            : 1,
            disable         : false,
            maxLength       : 3,

            infoTargets: {
                value       : undefined,
                cost        : undefined
            },

            content: {
                increment   : "+",
                decrement   : "-"
            },

            classes: {
                increment   : "",
                decrement   : "",
                input       : ""
            },

            callbacks       : {},

            format: {
                separator   : ""
            } 

        }

    function Plugin(element, settings) {
        //var self = this;
        this.element    = element;
        this.$element   = $(element);
        this.settings   = settings;
        this.init();
    }

    Plugin.prototype.init = function() {
        var self = this;

        this.$element.addClass("id-counter");
        this.$increment = $('<div class="id-counter-increment ' + this.settings.classes.increment + '">').text(this.settings.content.increment);
        this.$input     = $('<input class="id-counter-input ' + this.settings.classes.input + '">').attr("maxLength", this.settings.maxLength);
        this.$decrement = $('<div class="id-counter-decrement ' + this.settings.classes.decrement + '">').text(this.settings.content.decrement);

        this.$element.append(
            this.$decrement,
            this.$input,
            this.$increment
        );

        this.counter = {
            $increment  : this.$increment,
            $input      : this.$input,
            $decrememt  : this.$decrement
        }

        if (typeof this.settings.infoTargets.cost === "string") {
            this.$costTargets = $(this.settings.infoTargets.cost);
        } else {
            this.$costTargets = false;
        }

        if (this.settings.infoTargets.value && typeof this.settings.infoTargets.value === "string") {
            this.$others = $(this.settings.infoTargets.value);
        }
        
        this.settings.cost = parseInt(this.settings.cost) || 0;
        
        if (!this.settings.disable) {

            this.$increment.on("click", function(e) { 
                return self.incrementHandler(e);
            });
            this.$decrement.on("click", function(e) { 
                return self.decrementHandler(e);
            });
            
            this.$input.on("change", function(e) {
                return self.changeHandler(e);
            });

            this.$input.on("keypress", function(e){
                return self.keypressHandler(e);
            });

            this.$input.on("keydown", function(e){
                return self.keydownHandler(e);
            });


        } else {
            this.$increment.addClass('id-counter-increment-disable');
            this.$decrement.addClass('id-counter-decrement-disable');
            this.$input.prop("disabled", true);
        }

        this.setValue(this.settings.defaultValue);
    }

    Plugin.prototype.callback = function() {

        var callback = [].shift.call(arguments);

        if (typeof this.settings.callbacks[callback] === "function") {
            return this.settings.callbacks[callback].apply(null, arguments);
        } else {
            return true;
        }
    }

    Plugin.prototype.incrementHandler = function(e) {
        if(this.callback("beforeIncrement", this.counter) !== false) {
            var changed = false;
            var value = this.getValue();

            if (value + this.settings.step <= this.settings.max) {
                value = value + this.settings.step;
                changed = true;
            } else {
                value = this.settings.max;
            }

            if (value > this.settings.max - 1) {
                this.$increment.addClass("id-counter-increment-disable");
            }

            if (value > this.settings.min) {} else {
                value = this.settings.min + 1;
            }

            this.$decrement.removeClass("id-counter-decrement-disable");
            
            this.setValue(value);
            
            if(this.callback("afterIncrement", this.counter) !== false) {
                if (changed) {
                    this.$increment.trigger("idcounter.increment");
                    this.$increment.trigger("idcounter.change");
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    Plugin.prototype.decrementHandler = function(e) {
        if(this.callback("beforeDecrement", this.counter) !== false) {
            var changed = false;
            var value = this.getValue();

            if (value - this.settings.step >= this.settings.min) {
                value = value - this.settings.step;
                changed = true;
            } else {
                value = this.settings.min;
            }

            if (value < this.settings.min + 1) {
                this.$decrement.addClass("id-counter-decrement-disable");
            }

            if (value < this.settings.max) {} else {
                value = this.settings.max - 1;
            }

            this.$increment.removeClass("id-counter-increment-disable");
            
            this.setValue(value);
            
            if(this.callback("afterDecrement", this.counter) !== false) {
                if (changed) {
                    this.$increment.trigger("idcounter.decrement");
                    this.$increment.trigger("idcounter.change");
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    Plugin.prototype.changeHandler = function(e) {
        
        var value = this.getValue();

        if (value > this.settings.min) {
            this.$decrement.removeClass("nbtn_disable");

            if (value < this.settings.max) {
                this.increment.removeClass("nbtn_disable");
                value = parseInt(value / this.settings.step) * this.settings.step;
            } else {
                this.$increment.addClass("nbtn_disable");
                value = this.settings.max;
            }

        } else {
            this.$decrement.addClass("nbtn_disable");
            value = this.settings.min;
        }

        if (this.oldValue != value) {
            this.$increment.trigger("idcounter.change");
        } 

        this.setValue(value);

    }

    Plugin.prototype.keypressHandler = function(e) {
        var char = String.fromCharCode(e.which);

        return isNaN(char) ? false : true;

    }

    Plugin.prototype.keydownHandler = function(e) {
        if (e.which == 38) {
            this.incrementHandler();
            return false;
        } else if (e.which == 40) {
            this.decrementHandler();
        }
    }

    Plugin.prototype.setValue = function(value) {
        this.oldValue = value;
        this.$input.val(value);
        this.setOthers(value);
        this.setCost(value);
    }

    Plugin.prototype.getValue = function() {
        
        var value = this.$input.val();

        if (isNaN(value)) {
            value = this.settings.min;
        } else {
            value = parseInt(value);
        }

        return value;
    }

    Plugin.prototype.setOthers = function(value) {

        $.each(this.$others, function(index, element){
            
            if (element.tagName == "INPUT") {
                element.value=value; 
            } else {
                element.innerText = value;
            }
        });
    }

    Plugin.prototype.setCost = function(value) {
        this.$costTargets && this.$costTargets.text(this._separateString(value * this.settings.cost));
    }


    Plugin.prototype._separateString = function(string) {
        var string = "" + string;
        return string.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1' + this.settings.format.separator);
    }


    $.fn[pluginName] = function( options ) {

        var settings = $.extend(true, {}, defaults, options);


        $.each(this, function(index, element) {
            new Plugin(element, settings);
        });

        return this;

    };
})(jQuery);