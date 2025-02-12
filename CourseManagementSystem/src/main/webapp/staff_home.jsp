<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Staff Home</title>
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
  <h1>Welcome, Staff</h1>
  <nav>
    <a href="${pageContext.request.contextPath}/addCourse.jsp" class="nav-button">Add Course</a>
    <a href="${pageContext.request.contextPath}/deleteCourse.jsp" class="nav-button">Delete Course</a>
    <a href="${pageContext.request.contextPath}/editCourse.jsp" class="nav-button">Edit Course</a>
    <a href="${pageContext.request.contextPath}/importCourse.jsp" class="nav-button">Import Course</a>
  </nav>
  <button onclick="logout()">Logout</button>
</div>
</body>
</html>
