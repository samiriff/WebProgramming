function HelloWorld() {
    this.register();
}

HelloWorld.prototype = new Component();
HelloWorld.prototype.renderHtml = function(h) {
    h.push("<h1>Hello World!</h1>");
};