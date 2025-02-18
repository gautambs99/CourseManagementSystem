document.addEventListener("DOMContentLoaded", () => {
  const userType = sessionStorage.getItem("userType");
  const userEmail = sessionStorage.getItem("userEmail");

  if (!userType || !userEmail) {
    window.location.href = "index.html";
    return;
  }
  if (sessionStorage.getItem("userType") === "student") {
    document.getElementById("view-all-courses-btn").addEventListener("click", fetchCourses);
  }

  document.querySelectorAll("#logout").forEach((logoutBtn) => {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.clear();
      window.location.href = "index.html";
    });
  });

  document.querySelectorAll(".sidebar a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const page = this.getAttribute("data-page");
      document.querySelectorAll(".page").forEach((p) => (p.style.display = "none"));
      document.getElementById(`${userType}-${page}`).style.display = "block";
    });
  });

  const lastPage = sessionStorage.getItem(`${userType}-lastPage`) || "dashboard";
  document.getElementById(`${userType}-${lastPage}`).style.display = "block";
});

function fetchCourses() {
  fetch("CourseServlet")
      .then(response => response.json())
      .then(data => {
        const courseList = document.getElementById("courses");
        courseList.innerHTML = ""; // Clear previous results
        data.forEach(course => {
          let li = document.createElement("li");
          li.textContent = `${course.id} - ${course.name}`;
          courseList.appendChild(li);
        });
      })
      .catch(error => console.error("Error fetching courses:", error));
}
