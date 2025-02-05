<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Student Home</title>
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
    <h1>Welcome, Student</h1>
    <nav>
        <a href="${pageContext.request.contextPath}/enrollCourse.jsp" class="nav-button">Enroll Course</a>
        <a href="${pageContext.request.contextPath}/dropCourse.jsp" class="nav-button">Drop Course</a>
        <a href="${pageContext.request.contextPath}/viewCoursesStudent.jsp" class="nav-button">View Courses</a>
        <a href="${pageContext.request.contextPath}/discussionRoomStudent.jsp" class="nav-button">Discussion Room</a>
    </nav>
    <button onclick="logout()">Logout</button>
</div>
</body>
</html>
