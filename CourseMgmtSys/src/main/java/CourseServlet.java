import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import static Cons.Constants.*;

@WebServlet(COURSE_SERVLET)
public class CourseServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String searchQuery = request.getParameter("search");
        String courseId = request.getParameter("courseId");

        try (PrintWriter out = response.getWriter()) {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);

            if (searchQuery != null && !searchQuery.trim().isEmpty()) {
                PreparedStatement stmt = conn.prepareStatement(COURSE_SEARCH_QUERY);
                try {
                    stmt.setInt(1, Integer.parseInt(searchQuery));
                } catch (NumberFormatException e) {
                    stmt.setInt(1, -1);
                }
                stmt.setString(2, "%" + searchQuery + "%");

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
                    System.out.println(NO_COURSES_FOUND + searchQuery);
                }

                out.print(json.toString());
                conn.close();
                return;
            }

            if (courseId != null && !courseId.trim().isEmpty()) {
                PreparedStatement courseStmt = conn.prepareStatement(COURSE_DETAILS_QUERY);
                courseStmt.setInt(1, Integer.parseInt(courseId));
                ResultSet courseRs = courseStmt.executeQuery();

                if (!courseRs.next()) {
                    out.print(COURSE_NOT_FOUND);
                    return;
                }

                StringBuilder json = new StringBuilder("{");
                json.append("\"id\":").append(courseRs.getInt("course_id")).append(",");
                json.append("\"name\":\"").append(courseRs.getString("course_name")).append("\",");
                json.append("\"faculty_id\":").append(courseRs.getInt("faculty_id")).append(",");
                json.append("\"department_id\":").append(courseRs.getInt("department_id")).append(",");
                json.append("\"prerequisites\":").append(fetchPrerequisites(conn, Integer.parseInt(courseId)));
                json.append("}");

                out.print(json.toString());
                conn.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String fetchPrerequisites(Connection conn, int courseId) throws SQLException {
        PreparedStatement stmt = conn.prepareStatement(PREREQUISITES_QUERY);
        stmt.setInt(1, courseId);
        ResultSet rs = stmt.executeQuery();

        StringBuilder json = new StringBuilder("[");
        boolean first = true;

        while (rs.next()) {
            if (!first) json.append(",");
            json.append("{\"id\":").append(rs.getInt("prerequisite_id"))
                    .append(",\"name\":\"").append(rs.getString("course_name")).append("\"}");
            first = false;
        }

        json.append("]");
        return json.toString();
    }
}
