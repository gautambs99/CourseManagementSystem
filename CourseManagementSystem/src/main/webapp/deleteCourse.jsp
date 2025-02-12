<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Delete Course</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/styles.css">
</head>
<body>
<h2>Delete Course</h2>
<form action="deleteCourseServlet" method="post">
    Select Course: <select name="courseId"> <!-- Populate from DB --> </select><br>
    <input type="submit" value="Delete Course" onclick="return confirm('Are you sure?');">
</form>
</body>
</html>