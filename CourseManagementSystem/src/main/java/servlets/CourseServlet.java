package servlets;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import model.Course;


import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/courses")
public class CourseServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // Create sample courses
        Course introProgramming = new Course("Intro to Programming", "Learn basic programming concepts.");
        Course dataStructures = new Course("Data Structures", "Learn about data structures.");
        Course algorithms = new Course("Algorithms", "Learn about algorithms.");

        // Set prerequisites
        dataStructures.addPrerequisite(introProgramming);
        algorithms.addPrerequisite(dataStructures);

        // Add courses to a list
        List<Course> courses = new ArrayList<>();
        courses.add(introProgramming);
        courses.add(dataStructures);
        courses.add(algorithms);

        // Pass the course list to the JSP page
        req.setAttribute("courses", courses);
        req.getRequestDispatcher("/course.jsp").forward(req, resp);
    }
}
