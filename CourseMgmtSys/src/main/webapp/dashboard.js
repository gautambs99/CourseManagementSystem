document.addEventListener('DOMContentLoaded', function () {
    showPage('student-dashboard');
    highlightActiveTab('student-dashboard');

    const userType = sessionStorage.getItem("userType");
    const userEmail = sessionStorage.getItem("userEmail");

    if (!userType || !userEmail) {
        window.location.href = "index.html";
        return;
    }

    if (userType === "student") {
        document.getElementById("view-all-courses-btn").addEventListener("click", fetchCourses);
    }

    document.getElementById("logout").addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.clear();
        window.location.href = "index.html";
    });

    // Store last visited page
    const lastPage = sessionStorage.getItem(`${userType}-lastPage`) || "student-dashboard";
    showPage(lastPage);

    // Fix navigation links to switch pages properly
    document.querySelectorAll(".tab-link").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const pageId = this.getAttribute("data-page");
            showPage(pageId);
            highlightActiveTab(pageId);
            // Store the last visited page
            sessionStorage.setItem(`${userType}-lastPage`, pageId);
        });
    });
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });

    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }
}

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
function highlightActiveTab(pageId) {
    document.querySelectorAll(".tab-link").forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("data-page") === pageId) {
            link.classList.add("active");
        }
    });
}

    document.getElementById("profile-icon").addEventListener("click", function(event) {
    event.stopPropagation();
    document.getElementById("dropdown-menu").classList.toggle("show");
});

    document.addEventListener("click", function(event) {
    var menu = document.getElementById("dropdown-menu");
    var icon = document.getElementById("profile-icon");
    if (!menu.contains(event.target) && !icon.contains(event.target)) {
    menu.classList.remove("show");
}
});

