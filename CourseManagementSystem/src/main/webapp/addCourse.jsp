<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Add Course</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/styles.css">

</head>
<body>
<h2>Add Course</h2>

<form action="addCourseServlet" method="post">
    Course Name: <input type="text" name="courseName" required><br>
    Course Code: <input type="text" name="courseCode" required><br>
    Department: <select name="department"> <!-- Populate from DB --> </select><br>
    Instructor: <select name="instructor"> <!-- Populate from DB --> </select><br>
    Credits: <input type="number" name="credits" required><br>
    Course Description: <textarea name="description"></textarea><br>
    Start Date: <input type="date" name="startDate" required><br>
    End Date: <input type="date" name="endDate" required><br>
    Course Schedule: <input type="text" name="schedule" placeholder="e.g., Mon-Wed 10AM-12PM"><br>
    Upload Syllabus: <input type="file" name="syllabus"><br>
    <input type="submit" value="Add Course">
</form>

</body>
</html>
