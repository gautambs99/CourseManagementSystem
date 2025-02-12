<%@ page import="java.util.List" %>
<%@ page import="model.Course" %>
<html>
<body>
<h1>Available Courses</h1>
<ul>
    <%
        List<Course> courses = (List<Course>) request.getAttribute("courses");
        for (Course course : courses) {
            out.println("<li>");
            out.println("<b>" + course.getName() + "</b>: " + course.getDescription());

            if (!course.getPrerequisites().isEmpty()) {
                out.println("<ul>Prerequisites:");
                for (Course prereq : course.getPrerequisites()) {
                    out.println("<li>" + prereq.getName() + "</li>");
                }
                out.println("</ul>");
            }
            out.println("</li>");
        }
    %>
</ul>
</body>
</html>
