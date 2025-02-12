<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Faculty Home</title>
    <link rel="stylesheet" href="styles.css">
    <script>
        function logout() {
            sessionStorage.removeItem("loggedIn");
            sessionStorage.removeItem("userRole");
            window.location.href = "login.jsp";
        }
    </script>
</head>
<body>
<div class="container">
    <h1>Welcome, Professor</h1>
    <nav>
        <a href="${pageContext.request.contextPath}/viewCoursesFaculty.jsp" class="nav-button">View Courses</a>
        <a href="${pageContext.request.contextPath}/myClasses.jsp" class="nav-button">My Classes</a>
        <a href="${pageContext.request.contextPath}/grading.jsp" class="nav-button">Grading</a>
        <a href="${pageContext.request.contextPath}/discussionRoomStudent.jsp" class="nav-button">Discussion Room</a>
    </nav>
    <button onclick="logout()">Logout</button>
</div>
</body>
</html>
