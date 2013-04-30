function InputBox(value, size){
	this.register();
	this.value = value || "";
	this.size = size || 25;
}

MyInput.prototype = set(new Component(), {
    renderHtml : function(h) {
        h.push("<input type='text' size='"+this.size+"' "+
               "id='"+this.id+"' "+
               "onfocus='"+this.fireCode("_focus")+"' "+
               "onblur='"+this.fireCode("_blur")+"' "+
               "onkeypress='"+this.fireCode("_keypress")+"' "+
               "value='"+escapeHTML(this.value)+"' />");
    },

    _focus : function() {
        $(this.id).style.backgroundImage = "url(img/input-focus.gif)";
    },

    _blur : function() {
        $(this.id).style.backgroundImage = "url(img/input-blur.gif)";
    },

    _keypress : function() {
        // must dispatch after this event is processed or getValue()
        // will return the value before the key.  Set a timer to fire
        // immediately after the keypress event is processed.
        var self = this;
        setTimeout(function() {
            self.dispatch("change");
        }, 0);
    },

    getValue : function() {
        return $(this.id).value;
    },

    setValue : function(v) {
        $(this.id).value = v;
    },

    setEnabled : function(b) {
        $(this.id).disabled = !b;
    }
});
