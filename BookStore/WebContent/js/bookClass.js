function Book(name, isbn, author, price, isBestBook){
    this._name = name;
    this._isbn = isbn;
    this._author = author;
    this._price = price;
    this._isBestBook = isBestBook;
    
    var stock = 5;
    var logger = new Logger();
	
    this.getStock = function(){
        return stock;
    };
    
    this.addToCart = function(){
        if(stock == 0)
            alert("Out of Stock");
        else{
            stock--;
			logger.log("Book: " + this._name + " -- Purchased");
		}
    };
}