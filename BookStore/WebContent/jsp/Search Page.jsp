<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Search Results</title>
</head>
<body>
	Search Results: 
	<br/>
	
	<div id="res"></div>
	
	<script type="text/javascript">
		var searchResults = [];
		<c:forEach items="${searchResultBean.bookList}" var="book">
			var bookObj = new PublishedBook('${book.value.bookTitle}', '${book.value.isbn}', '${book.value.author}', 
					'${book.value.price}', '${book.value.imgSrc}', '${book.value.bestBook}', '${book.value.publishedDate}');
			searchResults.push(bookObj);
		</c:forEach>	 
		
		var str = '';
		for(var i=0; i<searchResults.length; i++){			
			 str += '<div class="odd">';          
                  
             str += '<div class="bookTitleLink"><a style="text-decoration:none;" id="bookID' + i + 100 + '" href="javascript:void(0)"'        + 'onmouseout="clearStatus()"'
                     + '>' 
                     + searchResults[i]._name + ', by ' + searchResults[i]._author + '</a>';
		}
		document.getElementById("shoppingCart").innerHTML = '';
		document.getElementById("res").innerHTML = str;
		
		//Adding listeners
		for(var i=0; i<searchResults.length; i++){
			document.getElementById("bookID" + i + 100).onmouseover = function(id){
				return function(){
					updateStatus2(searchResults[id]);
				};
			}(i);
			document.getElementById("bookID" + i + 100).onclick = function(id){
				return function(){
					updateShoppingCartStatus(searchResults[id]);
				};
			}(i);
		}
	</script>
	
</body>
</html>