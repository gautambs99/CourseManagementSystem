document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const userType = sessionStorage.getItem("userType")
  if (!userType) {
    // Redirect to login if not logged in
    window.location.href = "index.html"
    return
  }

  // Update page title based on user type
  const pageTitle = document.querySelector("h1")
  pageTitle.textContent = `${userType.charAt(0).toUpperCase() + userType.slice(1)} Services`

  // Customize services based on user type
  const serviceCards = document.querySelectorAll(".service-card")

  // Show/hide specific services based on user type
  serviceCards.forEach((card) => {
    const title = card.querySelector("h3").textContent.toLowerCase()

    switch (userType) {
      case "student":
        if (title.includes("database") || title.includes("seo")) {
          card.style.display = "none"
        }
        break
      case "faculty":
        if (title.includes("graphic") || title.includes("seo")) {
          card.style.display = "none"
        }
        break
      case "staff":
        // Staff can see all services
        break
    }
  })

  // Show appropriate sidebar and content
  const sidebar = document.querySelector(`.${userType}-sidebar`)
  const content = document.querySelector(`.${userType}-content`)
  if (sidebar && content) {
    sidebar.style.display = "block"
    content.style.display = "block"
  }

  // Handle navigation
  document.querySelectorAll(".sidebar a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const page = this.getAttribute("data-page")

      // Remove active class from all links
      document.querySelectorAll(".sidebar a").forEach((l) => l.classList.remove("active"))
      // Add active class to clicked link
      this.classList.add("active")

      // Handle page navigation
      handleNavigation(page)
    })
  })

  // Handle logout
  document.getElementById("logout").addEventListener("click", (e) => {
    e.preventDefault()
    sessionStorage.clear()
    window.location.href = "index.html"
  })

  // Handle course search
  document.querySelectorAll(".search-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const searchInput = this.previousElementSibling.value
      // Implement search functionality here
      console.log("Searching for:", searchInput)
    })
  })

  // Handle course form submission (for staff)
  const addCourseForm = document.getElementById("add-course-form")
  if (addCourseForm) {
    addCourseForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const courseData = {
        code: document.getElementById("course-code").value,
        name: document.getElementById("course-name").value,
        prerequisites: document.getElementById("prerequisites").value,
        credits: document.getElementById("credits").value,
      }
      // Implement course addition functionality here
      console.log("Adding course:", courseData)
      this.reset()
    })
  }

  // Handle course editing
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const courseItem = this.closest(".course-item")
      const courseName = courseItem.querySelector("h4").textContent
      // Implement edit functionality here
      console.log("Editing course:", courseName)
    })
  })

  // Handle course deletion
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const courseItem = this.closest(".course-item")
      const courseName = courseItem.querySelector("h4").textContent
      if (confirm(`Are you sure you want to delete ${courseName}?`)) {
        // Implement delete functionality here
        console.log("Deleting course:", courseName)
        courseItem.remove()
      }
    })
  })
})

function handleNavigation(page) {
  // Implement page navigation logic here
  console.log("Navigating to:", page)
  // You would typically show/hide different sections based on the page
}

