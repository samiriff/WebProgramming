function Logger() {

  if ( arguments.callee._singletonInstance )
    return arguments.callee._singletonInstance;
  arguments.callee._singletonInstance = this;

  this.log = function(message) {
    console.log(message);
  };
}