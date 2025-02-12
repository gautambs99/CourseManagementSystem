<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Drop Course</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/styles.css">
</head>
<body>
<h2>Drop Course</h2>
<form action="dropCourseServlet" method="post">
    Select Course: <select name="courseId"> <!-- Populate from DB --> </select><br>
    Reason (Optional): <textarea name="reason"></textarea><br>
    <input type="submit" value="Drop Course" onclick="return confirm('Are you sure?');">
</form>
</body>
</html>