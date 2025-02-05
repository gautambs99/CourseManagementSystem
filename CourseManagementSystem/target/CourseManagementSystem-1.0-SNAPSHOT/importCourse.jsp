<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Import Courses</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/styles.css">
</head>
<body>
<h2>Import Courses</h2>
<form action="importCourseServlet" method="post" enctype="multipart/form-data">
    Upload File: <input type="file" name="courseFile" required><br>
    Select Department: <select name="department"> <!-- Populate from DB --> </select><br>
    <input type="submit" value="Import Courses">
</form>
</body>
</html>