import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet; // ✅ Import ResultSet
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import static Cons.Constants.*;
@WebServlet("/FacultyAppointmentsServlet")
public class FacultyAppointmentsServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String facultyId = request.getParameter("facultyId");

        if (facultyId == null || facultyId.isEmpty()) {
            response.getWriter().write("{\"success\": false, \"message\": \"Missing faculty ID\"}");
            return;
        }

        try (PrintWriter out = response.getWriter();
             Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(
                     "SELECT a.appointment_id, a.appointment_datetime, a.status, s.name AS student_name " +
                             "FROM appointments a " +
                             "JOIN student s ON a.student_id = s.user_id " +
                             "WHERE a.faculty_id = ? ORDER BY a.appointment_datetime ASC")) {

            stmt.setInt(1, Integer.parseInt(facultyId));
            ResultSet rs = stmt.executeQuery();

            StringBuilder json = new StringBuilder("[");
            while (rs.next()) {
                json.append("{")
                        .append("\"appointmentId\":\"").append(rs.getInt("appointment_id")).append("\",")
                        .append("\"date\":\"").append(rs.getString("appointment_datetime")).append("\",")
                        .append("\"status\":\"").append(rs.getString("status")).append("\",")
                        .append("\"student\":\"").append(rs.getString("student_name")).append("\"")
                        .append("},");
            }

            if (json.length() > 1) json.setLength(json.length() - 1); // Remove trailing comma
            json.append("]");

            out.print(json.toString());

        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().write("{\"success\": false, \"message\": \"Server error\"}");
        }
    }
}
