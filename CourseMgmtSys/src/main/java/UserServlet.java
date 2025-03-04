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

@WebServlet("/UserServlet")
public class UserServlet extends HttpServlet {
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/dbcollege";
    private static final String JDBC_USER = "root"; // Change to your database user
    private static final String JDBC_PASS = "Siri@1234"; // Change to your database password

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String email = request.getParameter("email");

        if (email == null || email.isEmpty()) {
            response.getWriter().write("{\"success\": false, \"message\": \"Invalid email\"}");
            return;
        }

        // SQL Query to get user details
        String query = "SELECT u.name, u.email, u.user_id, " +
                "(SELECT student_id FROM students WHERE user_id = u.user_id LIMIT 1) AS student_id, " +
                "(SELECT faculty_id FROM faculty WHERE user_id = u.user_id LIMIT 1) AS faculty_id, " +
                "(SELECT department_name FROM students WHERE user_id = u.user_id LIMIT 1) AS student_department, " +
                "(SELECT department_name FROM faculty WHERE user_id = u.user_id LIMIT 1) AS faculty_department " +
                "FROM users u WHERE u.email = ?";

        try (PrintWriter out = response.getWriter();
             Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASS);
             PreparedStatement stmt = conn.prepareStatement(query)) {

            Class.forName("com.mysql.cj.jdbc.Driver");
            stmt.setString(1, email);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    String userName = rs.getString("name");
                    String userEmail = rs.getString("email");
                    String studentID = rs.getString("student_id");
                    String facultyID = rs.getString("faculty_id");
                    String studentDepartment = rs.getString("student_department");
                    String facultyDepartment = rs.getString("faculty_department");
                    String userID = (studentID != null) ? studentID : (facultyID != null) ? facultyID : "N/A";
                    // Determine which department to show
                    String department = (studentDepartment != null) ? studentDepartment : facultyDepartment;

                    // JSON Response
                    out.print("{\"success\": true, \"name\": \"" + userName + "\", " +
                            "\"email\": \"" + userEmail + "\", " + "\"userID\": \"" + userID + "\", " +
                            "\"department\": \"" + (department != null ? department : "N/A") + "\"}");
                } else {
                    out.print("{\"success\": false, \"message\": \"User not found\"}");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().write("{\"success\": false, \"message\": \"Server error\"}");
        }
    }
}
