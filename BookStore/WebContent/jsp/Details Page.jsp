<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@page import="model.Constants" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Book Details Page</title>
</head>
<body>
	Price = Rs. ${resultBean.price}
	<br/> 
    ISBN = ${resultBean.isbn} 
    <br/>
    Title = ${resultBean.bookTitle}
    <br/>
	
	Published on ${resultBean.publishedDate}
	<br/>
	<img src="${resultBean.imgSrc}"/>
	<br/>		
	
	<div id="div_stock">		
		var str = '';
	    if("${resultBean.stock}" == 0){
			str = "Out of Stock";
		}
	    else{
	    	str = "In Stock = " + ${resultBean.stock};
	    }
    	document.getElementById("div_stock").innerHTML = str;
	</div>		
	
	<br/>
	<input id="buttonBuy" type="button" value="Buy" />
	<input id="buttonClose" type="button" value="Close" />
	
	
    <script type="text/javascript">    	
	    var str = '';
	    if("${resultBean.stock}" == 0){
			str = "Out of Stock";
		}
	    else{
	    	str = "In Stock = " + ${resultBean.stock};
	    }
		document.getElementById("div_stock").innerHTML = str;
    
		document.getElementById("buttonBuy").onclick = function(){		
			$("#div_stock").load("MainController",
					{"taskType" : "<%=Constants.TaskType.ADD_TO_CART%>",
					 "isbn" : "${resultBean.isbn}"}
			);
		};
		document.getElementById("buttonClose").onclick = function(){
			document.getElementById("shoppingCart").innerHTML = '';
		};		
	</script>

</body>
</html>