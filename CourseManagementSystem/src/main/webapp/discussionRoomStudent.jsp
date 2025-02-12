<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Discussion Room</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/styles.css">
</head>
<body>
<h2>Discussion Room</h2>
<form action="discussionServlet" method="post">
    Select Course: <select name="courseId"> <!-- Populate from DB --> </select><br>
    New Topic: <textarea name="topic"></textarea><br>
    Attach File: <input type="file" name="attachment"><br>
    <input type="submit" value="Post">
</form>
</body>
</html>