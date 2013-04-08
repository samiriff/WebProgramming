function getAllBooks(){
    return books;
}

function getBookByISBN(isbn_key){
    for(var i=0; i<books.length; i++)
        if(books[i].isbn.indexOf(isbn_key) == 0)
            return books[i];
    return null;
}

function getBookByName(name){
    for(var i=0; i<books.length; i++){        
        if(books[i].name.toLowerCase().indexOf(name.toLowerCase()) != -1)
            return books[i];
    }
    return null;
}

function getSortedList(){
    
    var iMin;
    var n = books.length;
    for (var j = 0; j < n-1; j++) {
        iMin = j;
        for (var i = j+1; i < n; i++) {
            if (books[i].name < books[iMin].name) {                
                iMin = i;
            }
        }
     
        if ( iMin != j ) {
            var temp = books[j];
            books[j] = books[iMin];
            books[iMin] = temp;
        }
    }
    
    return books;
}

