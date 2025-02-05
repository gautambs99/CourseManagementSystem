<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Course Management System Login</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-white font-sans">
<div id="login-container" class="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-lg">
  <h2 id="login-title" class="text-2xl font-bold text-blue-900 mb-4">CMS Login</h2>

  <form id="login-form" class="space-y-4" onsubmit="return handleLogin(event)">
    <div>
      <label for="username" class="block text-gray-700 font-bold">Username:</label>
      <input type="text" id="username" name="username" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" required>
    </div>
    <div>
      <label for="password" class="block text-gray-700 font-bold">Password:</label>
      <input type="password" id="password" name="password" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" required>
    </div>

    <p class="text-sm text-gray-600">Login using your credentials to access the student portal.</p>
    <a href="#" class="text-blue-600 text-sm hover:underline">Forgot Password?</a>

    <button type="submit" class="w-full border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white">LOGIN</button>
  </form>
</div>

<script>
  function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Predefined login credentials
    const users = {
      "student1": { password: "password123", role: "student" },
      "faculty1": { password: "securepass", role: "faculty" },
      "staff1": { password: "adminpass", role: "staff" }
    };

    if (users[username] && users[username].password === password) {
      const role = users[username].role;
      sessionStorage.setItem("loggedIn", "true");
      sessionStorage.setItem("userRole", role);

      if (role === "faculty") {
        window.location.href = "faculty_home.jsp";
      } else if (role === "staff") {
        window.location.href = "staff_home.jsp";
      } else {
        window.location.href = "student_home.jsp";
      }
    } else {
      alert("Invalid username or password");
    }
  }

  function checkSession() {
    if (!sessionStorage.getItem("loggedIn")) {
      window.location.href = "login.jsp";
    }
  }
</script>
</body>
</html>
