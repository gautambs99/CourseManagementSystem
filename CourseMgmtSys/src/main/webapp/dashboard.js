document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const userType = sessionStorage.getItem("userType");
  if (!userType) {
    // Redirect to login if not logged in
    window.location.href = "index.html";
    return;
  }

  // Handle logout for all user types
  document.querySelectorAll("#logout").forEach((logoutBtn) => {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.clear();
      window.location.href = "index.html";
    });
  });

  // Handle navigation
  document.querySelectorAll(".sidebar a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const page = this.getAttribute("data-page");

      // Remove active class from all links
      document.querySelectorAll(".sidebar a").forEach((l) => l.classList.remove("active"));
      // Add active class to clicked link
      this.classList.add("active");

      // Handle page navigation
      handleNavigation(userType, page);
    });
  });

  // Handle course search
  document.querySelectorAll(".search-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const searchInput = this.previousElementSibling.value;
      console.log("Searching for:", searchInput);
    });
  });

  // Handle form submissions
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("Form submitted:", this.id);
    });
  });

  // Show the dashboard page by default
  //handleNavigation(userType, "dashboard");
  const lastPage = sessionStorage.getItem(`${userType}-lastPage`) || "dashboard";
  handleNavigation(userType, lastPage);

});

function handleNavigation(userType, page) {
  sessionStorage.setItem(`${userType}-lastPage`, page);
  console.log("Navigating to:", page);
  document.querySelectorAll(".page").forEach((p) => (p.style.display = "none"));
  const pageToShow = document.getElementById(`${userType}-${page}`);
  if (pageToShow) {
    pageToShow.style.display = "block";
  } else {
    console.error(`Page not found: ${userType}-${page}`);
  }
}
