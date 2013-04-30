<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Testing</title>
</head>
<body>

	<div id="page"></div>

	<script type="text/javascript" src="./js/Util.js"></script>
    <script type="text/javascript" src="./js/juic/component.js"></script>
    <script type="text/javascript" src="./js/InputForm.js"></script>
    
    <script type="text/javascript">
      function load() {
        var comp = new HelloWorld();
        comp.render("page");
      }
    </script>
    
    <script type="text/javascript">
    	load();
    </script>    
</body>
</html>