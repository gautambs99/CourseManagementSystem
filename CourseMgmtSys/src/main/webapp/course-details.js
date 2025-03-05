document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("courseId");

    if (!courseId) {
        document.getElementById("course-title").textContent = "No Course Selected";
        return;
    }

    fetch(`/CourseMgmtSys_war_exploded/CourseServlet?courseId=${courseId}`)
        .then(response => {
            console.log("📡 Fetching course details from:", `/CourseMgmtSys_war_exploded/CourseServlet?courseId=${courseId}`);
            return response.json();
        })
        .then(course => {
            console.log("✅ Course details received:", course);

            if (course.error || !course.id) {
                document.getElementById("course-title").textContent = "Course Not Found";
                return;
            }

            document.getElementById("course-id").textContent = course.id;
            document.getElementById("course-name").textContent = course.name;
            document.getElementById("course-description").textContent = course.description || "No description available.";
            document.getElementById("faculty-id").textContent = course.faculty_id || "N/A";
            document.getElementById("department-id").textContent = course.department_id || "N/A";

            const prereqList = document.getElementById("prereq-list");
            prereqList.innerHTML = "";

            if (!course.prerequisites || course.prerequisites.length === 0) {
                prereqList.innerHTML = "<li>No prerequisites</li>";
            } else {
                course.prerequisites.forEach(prereq => {
                    let li = document.createElement("li");
                    li.textContent = `${prereq.id} - ${prereq.name}`;
                    prereqList.appendChild(li);
                });
            }

            visualizeGraph(course);
        })
        .catch(error => console.error("❌ Error fetching course details:", error));
});

function visualizeGraph(course) {
    document.getElementById("graph-container").innerHTML = ""; // Clear previous graph

    if (!course || !course.prerequisites || course.prerequisites.length === 0) {
        document.getElementById("graph-container").innerHTML = "<p>No prerequisite visualization available.</p>";
        return;
    }

    const width = 900, height = 600;
    const svg = d3.select("#graph-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const nodes = [];
    const links = [];
    const levelMap = new Map(); // To store level of each node

    function processPrerequisites(prereq, parentId, level) {
        if (!nodes.some(n => n.id === prereq.id)) {
            nodes.push({ id: prereq.id, name: prereq.name });
            levelMap.set(prereq.id, level);
        }
        links.push({ source: parentId, target: prereq.id });

        if (prereq.prerequisites && prereq.prerequisites.length > 0) {
            prereq.prerequisites.forEach(subPrereq => processPrerequisites(subPrereq, prereq.id, level - 1));
        }
    }

    // Add the main course as the root node (highest level)
    nodes.push({ id: course.id, name: course.name });
    levelMap.set(course.id, 0);

    course.prerequisites.forEach(prereq => {
        processPrerequisites(prereq, course.id, -1);
    });

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(150))
        .force("charge", d3.forceManyBody().strength(-400))  // Stronger repulsion
        .force("x", d3.forceX(width / 2).strength(0.1)) // Center horizontally
        .force("y", d3.forceY().strength(1).y(d => (height / 2) + 150 + levelMap.get(d.id) * 100));  // Move graph down

    const link = svg.selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    const node = svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 20)
        .attr("fill", "lightblue")
        .call(drag(simulation));

    const text = svg.selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("dy", 30)  // Position text below node
        .attr("text-anchor", "middle")
        .text(d => d.name)
        .style("font-size", "14px")
        .style("font-weight", "bold");

    simulation.on("tick", () => {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);

        text.attr("x", d => d.x)
            .attr("y", d => d.y);
    });

    function drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
}
