import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet("/CourseServlet")
public class CourseServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String userId = request.getParameter("user_id");
        System.out.println("📡 Fetching courses for student ID: " + userId);

        JSONArray courseList = new JSONArray();

        try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/collegedb", "root", "root123");
             PreparedStatement stmt = conn.prepareStatement(
                     "SELECT c.course_id, c.course_name, c.department_id, " +
                             "CASE " +
                             "  WHEN FIND_IN_SET(c.course_id, s.completed_courses) > 0 THEN 'Completed' " +
                             "  WHEN FIND_IN_SET(c.course_id, s.enrolled_courses) > 0 THEN 'Ongoing' " +
                             "  WHEN FIND_IN_SET(c.course_id, s.to_do_courses) > 0 THEN 'Pending' " +
                             "  ELSE 'Not Taken' " +
                             "END AS status " +
                             "FROM student s " +  // 🔥 CHANGED FROM `students` TO `student`
                             "JOIN course c ON FIND_IN_SET(c.course_id, CONCAT(s.completed_courses, ',', s.enrolled_courses, ',', s.to_do_courses)) > 0 " +
                             "WHERE s.user_id = ?")) {

            stmt.setString(1, userId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                JSONObject course = new JSONObject();
                course.put("course_id", rs.getString("course_id"));
                course.put("course_name", rs.getString("course_name"));
                course.put("department_id", rs.getString("department_id"));
                course.put("status", rs.getString("status"));

                courseList.put(course);
            }

            System.out.println("✅ Courses retrieved successfully: " + courseList.toString());

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("❌ Database error: " + e.getMessage());
            response.getWriter().write("{\"success\": false, \"message\": \"Server error: " + e.getMessage() + "\"}");
        }

        try (PrintWriter out = response.getWriter()) {
            out.print(courseList.toString());
            out.flush();
        }
    }
}
