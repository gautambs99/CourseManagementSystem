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

    if (!course || !course.prerequisites) {
        document.getElementById("graph-container").innerHTML = "<p>No prerequisite visualization available.</p>";
        return;
    }

    const height = 800;
    const boxWidth = 220, boxHeight = 50;
    const horizontalSpacing = 300;
    const verticalSpacing = 120;

    function buildTree(node) {
        return {
            name: `${node.id} - ${node.name}`,
            children: (node.prerequisites || []).map(buildTree)
        };
    }

    const rootData = buildTree(course);
    const root = d3.hierarchy(rootData);

    // Initial layout
    const treeLayout = d3.tree().nodeSize([horizontalSpacing, verticalSpacing]);
    treeLayout(root);

    // 🛠 Fix x-positions so children are centered under parent
    root.eachAfter(node => {
        if (node.children && node.children.length > 1) {
            const totalWidth = (node.children.length - 1) * horizontalSpacing;
            const startX = node.x - totalWidth / 2;
            node.children.forEach((child, i) => {
                child.x = startX + i * horizontalSpacing;
            });
        } else if (node.children && node.children.length === 1) {
            node.children[0].x = node.x; // Align single child
        }
    });

    // 🛠 Normalize all nodes at same depth to same y-coordinate
    const levelY = new Map();
    root.descendants().forEach(d => {
        if (!levelY.has(d.depth)) {
            levelY.set(d.depth, d.y);
        }
        d.y = levelY.get(d.depth);
    });

    // 🔄 Centering
    const xExtent = d3.extent(root.descendants(), d => d.x);
    const xRange = xExtent[1] - xExtent[0];
    const offsetX = (Math.max(1400, xRange + 300) - xRange) / 2 - xExtent[0];

    const svg = d3.select("#graph-container").append("svg")
        .attr("width", Math.max(1400, xRange + 300))
        .attr("height", height);

    svg.append("defs").append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#333");

    const g = svg.append("g").attr("transform", `translate(${offsetX}, 80)`);

    // ✅ Draw links
    g.selectAll("path.link")
        .data(root.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d => {
            const isStraight = d.source.x === d.target.x;
            if (isStraight) {
                return `M${d.source.x},${d.source.y + boxHeight}
                        V${d.target.y}`;
            } else {
                return `M${d.source.x},${d.source.y + boxHeight}
                        V${(d.source.y + d.target.y) / 2}
                        H${d.target.x}
                        V${d.target.y}`;
            }
        })
        .attr("fill", "none")
        .attr("stroke", "#333")
        .attr("stroke-width", 1.5)
        .attr("marker-end", "url(#arrow)");

    // ✅ Draw nodes
    const node = g.selectAll("g.node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x - boxWidth / 2},${d.y})`);

    node.append("rect")
        .attr("width", boxWidth)
        .attr("height", boxHeight)
        .attr("rx", 6)
        .attr("fill", "#fff")
        .attr("stroke", "#333")
        .attr("stroke-width", 1.5);

    node.append("text")
        .attr("x", boxWidth / 2)
        .attr("y", boxHeight / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(d => d.data.name)
        .style("font-size", "12px")
        .style("font-family", "Segoe UI, sans-serif")
        .style("font-weight", "bold")
        .call(wrapText, boxWidth - 20);

    setTimeout(() => {
        const wrapper = document.getElementById("scroll-wrapper");
        wrapper.scrollLeft = (wrapper.scrollWidth - wrapper.clientWidth) / 2;
    }, 100);

    // ✅ Text wrapping
    function wrapText(text, width) {
        text.each(function () {
            const text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                lineHeight = 1.2;
            let word, line = [], lineNumber = 0,
                y = text.attr("y"),
                x = text.attr("x"),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y);

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", `${++lineNumber * lineHeight}em`)
                        .text(word);
                }
            }
        });
    }
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