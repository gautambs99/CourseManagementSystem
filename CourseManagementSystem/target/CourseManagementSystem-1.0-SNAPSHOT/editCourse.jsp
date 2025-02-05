<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Edit Course</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/styles.css">
</head>
<body>
<h2>Edit Course</h2>
<form action="editCourseServlet" method="post">
    Select Course: <select name="courseId"> <!-- Populate from DB --> </select><br>
    Course Name: <input type="text" name="courseName"><br>
    Instructor: <select name="instructor"> <!-- Populate from DB --> </select><br>
    Credits: <input type="number" name="credits"><br>
    Course Schedule: <input type="text" name="schedule"><br>
    <input type="submit" value="Update Course">
</form>
</body>
</html>