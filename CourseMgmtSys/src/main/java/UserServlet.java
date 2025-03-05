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
import static Cons.Constants.*;

@WebServlet(USER_SERVLET)
public class UserServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String email = request.getParameter(EMAIL);

        if (email == null || email.isEmpty()) {
            response.getWriter().write(INVALID_EMAIL);
            return;
        }

        try (PrintWriter out = response.getWriter();
             Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(USER_DETAILS_QUERY)) {

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
                    String department = (studentDepartment != null) ? studentDepartment : facultyDepartment;

                    out.print("{\"success\": true, \"name\": \"" + userName + "\", " +
                            "\"email\": \"" + userEmail + "\", \"userID\": \"" + userID + "\", " +
                            "\"department\": \"" + (department != null ? department : "N/A") + "\"}");
                } else {
                    out.print(USER_NOT_FOUND);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().write(SERVER_ERROR);
        }
    }
}
