<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Enroll in Course</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/styles.css">
</head>
<body>
<h2>Enroll in Course</h2>
<form action="enrollCourseServlet" method="post">
    Select Course: <select name="courseId"> <!-- Populate from DB --> </select><br>
    <input type="submit" value="Enroll">
</form>
</body>
</html>