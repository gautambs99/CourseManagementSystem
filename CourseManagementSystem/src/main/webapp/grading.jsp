<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Grading</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/styles.css">
</head>
<body>
<h2>Grading</h2>
<form action="gradingServlet" method="post">
    Select Course: <select name="courseId"> <!-- Populate from DB --> </select><br>
    Select Student: <select name="studentId"> <!-- Populate from DB --> </select><br>
    Assignment/Exam: <input type="text" name="assignment"><br>
    Enter Grade: <input type="text" name="grade"><br>
    Comments: <textarea name="comments"></textarea><br>
    <input type="submit" value="Submit Grade">
</form>
</body>
</html>