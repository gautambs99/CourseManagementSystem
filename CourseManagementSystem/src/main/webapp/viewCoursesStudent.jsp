<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>View Courses</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/styles.css">
</head>
<body>
<div class="container">
    <h2>View Courses</h2>
    <form action="viewCourses" method="GET" class="form-horizontal">
        <div class="form-group">
            <label for="search" class="control-label">Search:</label>
            <input type="text" id="search" name="search" class="form-control" placeholder="Enter course name or code">
        </div>
        <div class="form-group">
            <button type="submit" class="btn-primary">Search</button>
        </div>
    </form>

    <div class="grid-container">
        <!-- Example Grid Content -->
        <div class="grid-item">
            <img src="prereq.jpg" alt="Course 1" class="grid-image">
        </div>
        <!-- Add more grid items dynamically -->
    </div>
</div>
</body>
</html>
