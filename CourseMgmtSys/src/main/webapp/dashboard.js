document.addEventListener('DOMContentLoaded', function () {
    const userType = sessionStorage.getItem("userType");
    const userEmail = sessionStorage.getItem("userEmail");

    if (!userType || !userEmail) {
        window.location.href = "index.html";
        return;
    }

    fetchUserDetails(userEmail);

    if (userType === "student") {
        document.getElementById("view-all-courses-btn").addEventListener("click", fetchCourses);
    }

    document.getElementById("logout").addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.clear();
        window.location.href = "index.html";
    });

    const defaultPage = userType === "faculty" ? "faculty-dashboard" : "student-dashboard";
    const lastPage = sessionStorage.getItem(`${userType}-lastPage`) || defaultPage;
    showPage(lastPage);

    document.querySelectorAll(".tab-link").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const pageId = this.getAttribute("data-page");
            showPage(pageId);
            highlightActiveTab(pageId);
            sessionStorage.setItem(`${userType}-lastPage`, pageId);
        });
    });
});

function fetchUserDetails(email) {
    fetch("http://localhost:8080/CourseMgmtSys_war_exploded/UserServlet", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: email }),
    })
        .then(response => response.json())
        .then(userData => {
            if (userData.success) {
                let name = userData.name || "User";
                let userID = userData.userID || "N/A";
                let department = userData.department || "N/A";

                sessionStorage.setItem("userName", name);
                sessionStorage.setItem("userID", userID);
                sessionStorage.setItem("userDepartment", department);
                updateUserDetails(name, userData.email, userID, department);
            } else {
                console.error("Error fetching user details:", userData.message);
            }
        })
        .catch(error => console.error("Error fetching user details:", error));
}

function updateUserDetails(name, email, userID, department) {
    document.getElementById("user-name").textContent = name || "User";
    document.getElementById("profile-name").textContent = name || "User";
    document.getElementById("profile-email").textContent = email || "N/A";
    document.getElementById("profile-id").textContent = userID || "N/A";
    document.getElementById("profile-department").textContent = department || "N/A";
}

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
    const searchQuery = document.getElementById("course-search-input").value.trim();
    let url = "/CourseMgmtSys_war_exploded/CourseServlet";

    if (searchQuery) {
        url += `?search=${encodeURIComponent(searchQuery)}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("✅ Courses received:", data);
            const courseList = document.getElementById("courses");
            courseList.innerHTML = "";

            if (!Array.isArray(data) || data.length === 0) {
                courseList.innerHTML = "<li>No courses found</li>";
                return;
            }

            data.forEach(course => {
                let li = document.createElement("li");
                li.textContent = `${course.id} - ${course.name}`;
                li.setAttribute("data-course-id", course.id);
                li.classList.add("course-item");
                li.style.cursor = "pointer";
                li.addEventListener("click", function () {
                    window.location.href = `course-details.html?courseId=${course.id}`;
                });
                courseList.appendChild(li);
            });
        })
        .catch(error => console.error("❌ Error fetching courses:", error));
}
