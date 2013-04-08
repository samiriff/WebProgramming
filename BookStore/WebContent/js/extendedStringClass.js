function ExtendedString(str){
    String.call(str);
	
	this.reverse = function(){
		var revStr = '';
		for(var i=str.length - 1; i>=0; i--)
			revStr += str[i];
		return revStr;
	};
}

ExtendedString.prototype = new String();