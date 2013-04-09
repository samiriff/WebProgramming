<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@page import="model.Constants" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<link rel="stylesheet"
	href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.10/themes/dot-luv/jquery-ui.css" />
<link href="css/book_styles.css" type="text/css" rel="stylesheet" />

<title>Book Store</title>
</head>

<body>
	<div style="margin-left: 45%">
		<input id="button_home" type="button" value="Enter the AJAX Bookshop"/>
		<input id="button_rest" type="button" value="Test REST API"/>
	</div>
	
	<div id="ajax_filler">
	</div>
	
	
	
	<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
	<script src="http://code.jquery.com/ui/1.10.2/jquery-ui.js"></script>
	<script type="text/javascript" src="./js/MainPage.js"></script>
	<script type="text/javascript">
		$("#button_home").button().click(function () {			
			$("#ajax_filler").load("MainController",
					{"taskType" : "<%=Constants.TaskType.DISPLAY_ALL_BOOKS%>"});
			$("#button_home").prop('value', 'Refresh');
		});
		
		$("#button_rest").button().click(function () {
			$("#ajax_filler").load("MainController",
					{"taskType" : "<%=Constants.TaskType.REST_API%>"});			
		});
		
	</script>
	
	
</body>
</html>