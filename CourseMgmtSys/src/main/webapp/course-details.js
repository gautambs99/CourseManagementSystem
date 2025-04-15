document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("courseId");
    if (!courseId) {
        console.error("❌ No Course ID provided in URL.");
        return;
    }
    console.log("📡 Fetching course details for:", courseId);
    fetch(`/CourseMgmtSys_war_exploded/CourseServlet?courseId=${courseId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(course => {
            if (!course || course.error) {
                console.error("❌ API Error:", course.error || "Invalid response");
                document.getElementById("course-id").textContent = "Error";
                document.getElementById("course-name").textContent = "Error loading course details";
                return;
            }
            console.log("✅ Course details received:", course);
            document.getElementById("course-id").textContent = course.id;
            document.getElementById("course-name").textContent = course.name;
            visualizeGraph(course);
        })
        .catch(error => {
            console.error("❌ Fetch Error:", error);
            document.getElementById("course-id").textContent = "Error";
            document.getElementById("course-name").textContent = "Error loading course details";
        });
});
function visualizeGraph(course) {
    document.getElementById("graph-container").innerHTML = "";
    if (!course || !course.prerequisites || course.prerequisites.length === 0) {
        document.getElementById("graph-container").innerHTML = "<p>No prerequisite visualization available.</p>";
        return;
    }
    const width = 600, height = 600;
    const svg = d3.select("#graph-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    // ✅ Define arrowhead marker
    svg.append("defs").append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 25)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto") // ✅ dynamic rotation
        .append("path")
        .attr("d", "M0,-5L10,0L0,5") // ✅ standard triangle for arrows
        .attr("fill", "black");


    let nodes = [];
    let links = [];
    let yPosition = 100;
    function processPrerequisites(prereq, parentId, depth = 1) {
        const y = 50 + depth * 120;
        nodes.push({ id: prereq.id, name: prereq.name, y: y });
        if (parentId) {
            links.push({ source: parentId, target: prereq.id });
        }
        if (prereq.prerequisites && prereq.prerequisites.length > 0) {
            prereq.prerequisites.forEach(sub => processPrerequisites(sub, prereq.id, depth + 1));
        }
    }

    let rootNode = { id: course.id, name: course.name, y: 50 };
    nodes.push(rootNode);
    if (course.prerequisites.length > 0) {
        processPrerequisites(course.prerequisites[0], course.id,1);
    }
    const xCenter = width / 2;
    nodes.forEach(node => node.x = xCenter);
    // ✅ Draw links with tiny x-offsets to trigger arrow rendering
    const link = svg.selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow)")
        .attr("x1", d => nodes.find(n => n.id === d.source).x)
        .attr("y1", d => nodes.find(n => n.id === d.source).y)
        .attr("x2", d => nodes.find(n => n.id === d.target).x)
        .attr("y2", d => nodes.find(n => n.id === d.target).y);

    // ✅ Draw nodes
    svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 20)
        .attr("fill", "lightblue")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("cx", xCenter)
        .attr("cy", d => d.y);
    // ✅ Add text labels
    svg.selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("dy", 5)
        .attr("dx", 30)
        .attr("text-anchor", "start")
        .text(d => d.name)
        .attr("x", xCenter)
        .attr("y", d => d.y)
        .style("font-size", "14px")
        .style("font-weight", "bold");
}
// ✅ Return button functionality
document.addEventListener("DOMContentLoaded", function () {
    const returnBtn = document.getElementById("return-to-search");
    if (returnBtn) {
        returnBtn.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior
            console.log("🔄 Switching back to Course Search tab...");
            sessionStorage.setItem("lastPage", "student-course-search");
            window.location.href = "student.html";
        });
    } else {
        console.error("❌ Return button not found.");
    }
});