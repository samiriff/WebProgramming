function PublishedBook(name, isbn, author, price, imgSrc, isBestBook, publishedDate){
    Book.call(this, name, isbn, author, price, isBestBook);
	this._imgSrc = imgSrc;
	this._publishedDate = publishedDate;
}

PublishedBook.prototype = new Book();