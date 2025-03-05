import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/CourseServlet")
public class CourseServlet extends HttpServlet {
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/dbcollege";
    private static final String JDBC_USER = "root";
    private static final String JDBC_PASS = "Siri@1234";

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String searchQuery = request.getParameter("search");
        String courseId = request.getParameter("courseId");

        try (PrintWriter out = response.getWriter()) {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASS);

            // **Handle Search Query**
            if (searchQuery != null && !searchQuery.trim().isEmpty()) {
                String query = "SELECT course_id, course_name FROM courses WHERE course_id = ? OR course_name LIKE ?";
                PreparedStatement stmt = conn.prepareStatement(query);

                try {
                    stmt.setInt(1, Integer.parseInt(searchQuery));  // Search by ID
                } catch (NumberFormatException e) {
                    stmt.setInt(1, -1);  // Fallback
                }
                stmt.setString(2, "%" + searchQuery + "%");  // Partial name match

                ResultSet rs = stmt.executeQuery();
                StringBuilder json = new StringBuilder("[");
                boolean found = false;

                while (rs.next()) {
                    if (json.length() > 1) json.append(",");
                    json.append("{\"id\":").append(rs.getInt("course_id"))
                            .append(",\"name\":\"").append(rs.getString("course_name")).append("\"}");
                    found = true;
                }
                json.append("]");

                if (!found) {
                    System.out.println("🔴 No courses found for search: " + searchQuery);
                }

                out.print(json.toString());
                conn.close();
                return;
            }

            // **Handle Course Details Request**
            if (courseId != null && !courseId.trim().isEmpty()) {
                String courseQuery = "SELECT * FROM courses WHERE course_id = ?";
                PreparedStatement courseStmt = conn.prepareStatement(courseQuery);
                courseStmt.setInt(1, Integer.parseInt(courseId));
                ResultSet courseRs = courseStmt.executeQuery();

                if (!courseRs.next()) {
                    out.print("{\"error\": \"Course not found\"}");
                    return;
                }

                StringBuilder json = new StringBuilder("{");
                json.append("\"id\":").append(courseRs.getInt("course_id")).append(",");
                json.append("\"name\":\"").append(courseRs.getString("course_name")).append("\",");
                json.append("\"description\":\"").append(courseRs.getString("description") == null ? "No description available" : courseRs.getString("description")).append("\",");
                json.append("\"faculty_id\":").append(courseRs.getInt("faculty_id")).append(",");
                json.append("\"department_id\":").append(courseRs.getInt("department_id")).append(",");

                json.append("\"prerequisites\":").append(fetchPrerequisites(conn, Integer.parseInt(courseId)));
                json.append("}");

                out.print(json.toString());
                conn.close();
                return;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String fetchPrerequisites(Connection conn, int courseId) throws SQLException {
        String prereqQuery = "SELECT p.prerequisite_course_id, c.course_name FROM prerequisites p " +
                "JOIN courses c ON p.prerequisite_course_id = c.course_id " +
                "WHERE p.course_id = ?";
        PreparedStatement stmt = conn.prepareStatement(prereqQuery);
        stmt.setInt(1, courseId);
        ResultSet rs = stmt.executeQuery();

        StringBuilder json = new StringBuilder("[");
        boolean first = true;

        while (rs.next()) {
            if (!first) json.append(",");
            json.append("{\"id\":").append(rs.getInt("prerequisite_course_id"))
                    .append(",\"name\":\"").append(rs.getString("course_name")).append("\",")
                    .append("\"prerequisites\":").append(fetchPrerequisites(conn, rs.getInt("prerequisite_course_id")))
                    .append("}");
            first = false;
        }

        json.append("]");
        return json.toString();
    }
}
