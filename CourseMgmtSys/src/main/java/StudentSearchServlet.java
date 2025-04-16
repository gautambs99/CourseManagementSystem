import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import static Cons.Constants.*;

@WebServlet("/StudentSearchServlet")
public class StudentSearchServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");


        String search = request.getParameter("query");

        if (search == null || search.trim().isEmpty()) {
            response.getWriter().write("{\"success\": false, \"message\": \"Empty query\"}");
            return;
        }

        try (PrintWriter out = response.getWriter();
             Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {

            String sql = "SELECT u.user_id, u.name, s.department_id, s.completed_courses, s.enrolled_courses, s.to_do_courses " +
                    "FROM user u JOIN student s ON u.user_id = s.user_id " +
                    "WHERE LOWER(u.name) LIKE ?";

            PreparedStatement stmt = conn.prepareStatement(
                    "SELECT u.user_id, u.name, s.department_id, s.completed_courses, s.enrolled_courses, s.to_do_courses " +
                            "FROM user u JOIN student s ON u.user_id = s.user_id " +
                            "WHERE LOWER(u.name) LIKE ?"
            );
            stmt.setString(1, "%" + search.toLowerCase() + "%");

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                JSONObject student = new JSONObject();
                student.put("name", rs.getString("name"));
                student.put("department", rs.getInt("department_id"));

                JSONArray courses = new JSONArray();
                appendCourses(rs.getString("completed_courses"), "Completed", courses);
                appendCourses(rs.getString("enrolled_courses"), "Ongoing", courses);
                appendCourses(rs.getString("to_do_courses"), "Pending", courses);

                JSONObject result = new JSONObject();
                result.put("success", true);
                result.put("student", student);
                result.put("courses", courses);

                out.print(result.toString());
            } else {
                out.print("{\"success\": false, \"message\": \"Student not found\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setContentType("application/json");
            response.getWriter().write("{\"success\": false, \"message\": \"Server error occurred.\"}");
        }
    }

    private void appendCourses(String csv, String status, JSONArray courses) {
        if (csv != null && !csv.trim().isEmpty()) {
            for (String name : csv.split(",")) {
                JSONObject obj = new JSONObject();
                obj.put("name", name.trim());
                obj.put("status", status);
                courses.put(obj);
            }
        }
    }
}
