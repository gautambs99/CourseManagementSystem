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

@WebServlet("/CourseServlet")
public class CourseServlet extends HttpServlet {
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/dbcollege";
    private static final String JDBC_USER = "root";  // Change this to your MySQL username
    private static final String JDBC_PASS = "Siri@1234";  // Change this to your MySQL password

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASS);
            String query = "SELECT course_id, course_name FROM courses";
            PreparedStatement stmt = conn.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();

            StringBuilder json = new StringBuilder("[");
            while (rs.next()) {
                if (json.length() > 1) json.append(",");
                json.append("{\"id\":").append(rs.getInt("course_id"))
                        .append(",\"name\":\"").append(rs.getString("course_name")).append("\"}");
            }
            json.append("]");

            out.print(json.toString());
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
