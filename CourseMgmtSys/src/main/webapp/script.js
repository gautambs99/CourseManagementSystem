document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const errorMessage = document.getElementById("errorMessage")

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const userType = document.getElementById("userType").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    // Simple client-side validation
    if (!userType || !email || !password) {
      showError("Please fill in all fields.")
      return
    }

    // Check credentials based on user type
    let isValidLogin = false

    switch (userType) {
      case "student":
        isValidLogin = email === "student@example.com" && password === "studentpass"
        break
      case "faculty":
        isValidLogin = email === "faculty@example.com" && password === "facultypass"
        break
      case "staff":
        isValidLogin = email === "staff@example.com" && password === "staffpass"
        break
      case "external-institute":
        isValidLogin = email === "external@example.com" && password === "externalpass"
        break
    }

    if (isValidLogin) {
      // Store user type in sessionStorage for dashboard use
      sessionStorage.setItem("userType", userType)
      // Redirect to dashboard
      window.location.href = "dashboard.html"
    } else {
      showError("Invalid credentials. Please try again.")
    }
  })

  function showError(message) {
    errorMessage.textContent = message
    errorMessage.style.display = "block"
  }
})

