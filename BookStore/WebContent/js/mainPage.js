var isThumbnailView = true;
        var list = getAllBooks();
        var bookObjs1 = convertJSONToBookObjs(list);
        displayBooks(list);
        
        function displayBooks(bookList){          
            
            var str = '';
            for(var i=0; i<bookList.length; i++){
                str += '<div class="'; 
                
                if(bookList[i].isBestBook){
                    str += 'bestBook">';
                }
                else {
                    if(i%3 == 0)
                        str += 'even">';
                    else
                        str += 'odd">'; 
                }
                
                if(isThumbnailView)
                    str += '<img src="' + bookList[i].imgSrc + '"/>';
                     
                str += '<div class="bookTitleLink"><a style="text-decoration:none;" id="bookID' + i + '" href="javascript:void(0)"'        + ' onmouseout="clearStatus()"'
                        + '>' 
                        + bookList[i].name + ', by ' + bookList[i].author + '</a>'
                        + '<div class="popup">'
                        + 'Price = Rs.' + bookList[i].price + '<br/>'
                        + 'ISBN = ' + bookList[i].isbn + '<br/>'                     
                        + '</div>'
                        + '</div>'
                        + '</div>';
				
            }
            
            document.getElementById("bookList").innerHTML = str;
			updateOnMouseOverListeners();
			updateOnClickListeners();
        }
		
		//Terrible closure problem fixed
		function updateOnMouseOverListeners(){
			for(var i=0; i<bookObjs1.length; i++){
				document.getElementById("bookID" + i).onmouseover = function(id){
					return function(){
						updateStatus2(bookObjs1[id]);
					};
				}(i);
			}
		}
		
		//Terrible closure problem fixed
		function updateOnClickListeners(){
			for(var i=0; i<bookObjs1.length; i++){
				document.getElementById("bookID" + i).onclick = function(id){
					return function(){
						updateShoppingCartStatus(bookObjs1[id]);
					};
				}(i);
			}
		}
        
        function updateStatus(price, isbn, imgSrc, name){
            var str = 'Price = Rs.' + price + '<br/>' 
                + 'ISBN = ' + isbn + '<br/>'
                + 'Title = ' + name + '<br/>'
                + '<img style="width: 500px; height: 500px;" src="' + imgSrc + '"/>';
            document.getElementById("selectedBook").innerHTML = str;
        }
        
        function updateStatus2(bookObj){
            var str = 'Price = Rs.' + bookObj._price + '<br/>' 
                + 'ISBN = ' + bookObj._isbn + '<br/>'
                + 'Title = ' + bookObj._name + '<br/>'		
                + '<img style="width: 300px; height: 500px;" src="' + bookObj._imgSrc + '"/>';
            document.getElementById("selectedBook").innerHTML = str;
        }   
		
		
        function clearStatus(){
            document.getElementById("selectedBook").innerHTML = "";            
        }
        
        function search(){            
            var bookList = [];
            var query = document.getElementById("searchBarInput").value;
            var book = getBookByISBN(query);
            if(book != null){
                bookList.push(book);
                displayBooks(bookList);
            }
            else{
                book = getBookByName(query);
                if(book != null){
                    bookList.push(book);
                    displayBooks(bookList);
                }
            }
        }
        
        function sort(){
            var bookList = getSortedList();
            displayBooks(bookList);
        }
        
        function toggleView(){
            isThumbnailView = !isThumbnailView;
            
            if(isThumbnailView){
                document.getElementById("bookList").className = 'thumbnail';
                document.getElementById("toggleButton").value = 'Switch to List View';
            }
            else{
                document.getElementById("bookList").className = 'listView';
                document.getElementById("toggleButton").value = 'Switch to Thumbnail View';
            }
            
            var list = getAllBooks();
            displayBooks(list);
        }
        
        function convertJSONToBookObjs(bookList){
            var bookObjs = [];
            for(var i=0; i<bookList.length; i++){
                var bookObj = new PublishedBook(bookList[i].name, bookList[i].isbn, bookList[i].author, bookList[i].price, bookList[i].imgSrc, bookList[i].isBestBook, bookList[i].publishedDate);
                bookObjs.push(bookObj);
            }
            return bookObjs;
        }
        
        function displayBookObjs(bookObjs){
            var str = '';
            for(var i=0; i<bookObjs.length; i++){                
                str += bookObjs[i].getStock() + '<br/>';
            }
            document.getElementById("shoppingCart").innerHTML = str;
        }
		
		function clearInnerHTML(elementID){
			document.getElementById(elementID).innerHTML = '';
		}