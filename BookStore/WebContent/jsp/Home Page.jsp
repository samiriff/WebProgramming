<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%@page import="model.Constants" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>	
	<head>        
		<title>Book Shop </title>
		<link href="css/book_styles.css" type="text/css" rel="stylesheet"/>		
	</head>	
	<body id="content">
		<h1 class="styled-title">Book Shop</h1>
		<div style="text-align: center;;"> 
			<form name="input" action="./Add Books.html" method="get">				
				<input class="styled-button-1"type="submit" value="Add Book"/>
                <input class="styled-button-1"type="button" value="See All Books" onclick="window.location.reload(true);"/>
                <input class="styled-button-1"type="button" value="Sort Books by Title" onclick="sort();"/>
                <input class="styled-button-1"type="button" id="toggleButton" value="Switch to List View" onclick="toggleView();"/>
			</form>
		</div>
        
        <br />
		<div id="shoppingCart" style="border-color:green; border-width:20px;" class="statusBar" onclick="">		
        </div>
        <div id="selectedBook" class="statusBar" style="left:80%">
        </div>
        
        
        <br />
        <div id="searchBar" class="styled-search-bar">
            Search Bar:
            <input id="searchBarInput" type="text" onkeydown="if(event.keyCode == 13) search()"/>
        </div>
		
		<br/>
		<br/>
		<br/>
		<br/>
        
        <div id="searchResults" style="width: 30%; float:right;">       
        </div>
        <div id="bookList" class="thumbnail" style="width: 70%; float: left;">
        </div>
        
        <div id="ajax_description">
        </div>
        
        
        <script type="text/javascript" src="js/loggerClass.js"></script>
        		
        <script type="text/javascript">
        	//Loading JSON array using beans from Server
	        var books = [];
	    	<c:forEach items="${bookStoreBean.bookList}" var="book">
	    		books.push({name : '${book.bookTitle}',
	    					isbn : '${book.isbn}',
	    					author : '${book.author}',
	    					price : '${book.price}',
	    					imgSrc : '${book.imgSrc}',
	    					isBestBook : ${book.bestBook},
	    					publishedDate : '${book.publishedDate}'});
	    	</c:forEach>	    	
        </script>
        
        <script type="text/javascript" src="js/bookDatabase.js"></script>
        <script type="text/javascript" src="js/bookClass.js"></script>   
		<script type="text/javascript" src="js/publishedBookClass.js"></script>
		
		<script type="text/javascript">
	        function updateShoppingCartStatus(bookObj){            	
				$("#shoppingCart").load("MainController",
							{"taskType" : "<%=Constants.TaskType.SHOPPING_CART%>",
							 "isbn" : bookObj._isbn});				
	        }
        </script>
        
        <script type="text/javascript" src="js/mainPage.js"></script>   
        
        <script type="text/javascript">
        	$("#searchBar").keyup(function(){
        		$("#searchResults").load("MainController",
    					{"taskType" : "<%=Constants.TaskType.SEARCH%>",
        				 "searchKey" : $("#searchBarInput").val()});
        	});
        </script>
        
        
    
    </body>
	
</html>
	