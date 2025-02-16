document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const userType = sessionStorage.getItem("userType")
  if (!userType) {
    // Redirect to login if not logged in
    window.location.href = "index.html"
    return
  }

  // Handle logout for all user types
  document.querySelectorAll("#logout").forEach((logoutBtn) => {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      sessionStorage.clear()
      window.location.href = "index.html"
    })
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
      handleNavigation(userType, page)
    })
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

  // Handle file upload (for external institute)
  const fileUploadForm = document.getElementById("file-upload-form")
  const uploadStatus = document.getElementById("upload-status")

  if (fileUploadForm) {
    fileUploadForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const fileInput = document.getElementById("file-upload")
      const fileDescription = document.getElementById("file-description").value
      const file = fileInput.files[0]

      if (file) {
        // Simulating file upload process
        uploadStatus.textContent = "Uploading..."
        uploadStatus.className = ""

        setTimeout(() => {
          // Simulated successful upload
          uploadStatus.textContent = `File "${file.name}" uploaded successfully!`
          uploadStatus.className = "success"
          console.log("File uploaded:", file.name)
          console.log("File description:", fileDescription)
          fileUploadForm.reset()
        }, 2000)
      } else {
        uploadStatus.textContent = "Please select a file to upload."
        uploadStatus.className = "error"
      }
    })
  }

  // Show the dashboard page by default
  handleNavigation(userType, "dashboard")
})

function handleNavigation(userType, page) {
  console.log("Navigating to:", page)

  // Hide all pages
  document.querySelectorAll(".page").forEach((p) => (p.style.display = "none"))

  // Show the selected page
  const pageToShow = document.getElementById(`${userType}-${page}`)
  if (pageToShow) {
    pageToShow.style.display = "block"
  } else {
    console.error(`Page not found: ${userType}-${page}`)
  }
}

