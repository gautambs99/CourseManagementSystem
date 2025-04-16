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
import java.util.Properties;
import jakarta.mail.*;
import jakarta.mail.internet.*;

import static Cons.Constants.*;

@WebServlet("/AppointmentServlet")
public class AppointmentServlet extends HttpServlet {

    // ✅ Handle Appointment Booking (POST)
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String studentId = request.getParameter("studentId");
        String facultyId = request.getParameter("facultyId");
        String appointmentDateTime = request.getParameter("appointmentDateTime");

        System.out.println("🔄 Booking Appointment Request Received:");
        System.out.println("Student ID: " + studentId);
        System.out.println("Faculty ID: " + facultyId);
        System.out.println("Appointment DateTime: " + appointmentDateTime);

        if (studentId == null || facultyId == null || appointmentDateTime == null ||
                studentId.isEmpty() || facultyId.isEmpty() || appointmentDateTime.isEmpty()) {
            response.getWriter().write("{\"success\": false, \"message\": \"Invalid input data\"}");
            return;
        }

        try (PrintWriter out = response.getWriter();
             Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(
                     "INSERT INTO appointments (student_id, faculty_id, appointment_datetime, status) VALUES (?, ?, ?, ?)"
             )) {

            stmt.setInt(1, Integer.parseInt(studentId));
            stmt.setInt(2, Integer.parseInt(facultyId));
            stmt.setString(3, appointmentDateTime);
            stmt.setString(4, "Pending");

            int result = stmt.executeUpdate();

            if (result > 0) {
                System.out.println("✅ Appointment successfully stored in database.");
                out.print("{\"success\": true, \"message\": \"Appointment booked successfully\"}");
            } else {
                System.out.println("❌ Database insert failed.");
                out.print("{\"success\": false, \"message\": \"Failed to book appointment\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().write("{\"success\": false, \"message\": \"Server error: " + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String appointmentId = request.getParameter("appointmentId");
        String status = request.getParameter("status");

        System.out.println("🛠️ Updating status for appointment ID: " + appointmentId + " to " + status);

        try (PrintWriter out = response.getWriter();
             Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(
                     "UPDATE appointments SET status = ? WHERE appointment_id = ?")) {

            stmt.setString(1, status);
            stmt.setInt(2, Integer.parseInt(appointmentId));

            int rowsUpdated = stmt.executeUpdate();

            if (rowsUpdated > 0) {
                out.print("{\"success\": true}");
            } else {
                out.print("{\"success\": false, \"message\": \"No rows updated\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().write("{\"success\": false, \"message\": \"Server error\"}");
        }
    }

    private void sendEmailToStudent(String toEmail, String studentName, String status, String dateTime) {
        final String fromEmail = "your-email@gmail.com"; // change
        final String password = "your-app-password";     // use app password if using Gmail

        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        Session session = Session.getInstance(props, new jakarta.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(fromEmail));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(toEmail)
            );
            message.setSubject("Appointment Status Update");
            message.setText("Hello " + studentName + ",\n\nYour appointment scheduled for "
                    + dateTime + " has been " + status + ".\n\nRegards,\nCourse Management System");

            Transport.send(message);
            System.out.println("✅ Email sent to: " + toEmail);

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    // ✅ Handle Appointment Retrieval (GET)
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String studentId = request.getParameter("userId");

        if (studentId == null || studentId.isEmpty()) {
            response.getWriter().write("{\"success\": false, \"message\": \"Invalid student ID\"}");
            return;
        }

        try (PrintWriter out = response.getWriter();
             Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(
                     "SELECT a.appointment_id, a.appointment_datetime, a.status, f.name AS faculty_name " +
                             "FROM appointments a " +
                             "JOIN faculty f ON a.faculty_id = f.user_id " +
                             "WHERE a.student_id = ? ORDER BY a.appointment_datetime ASC")) {

            stmt.setInt(1, Integer.parseInt(studentId));

            ResultSet rs = stmt.executeQuery();
            StringBuilder json = new StringBuilder("[");

            while (rs.next()) {
                json.append("{\"appointmentId\":\"").append(rs.getInt("appointment_id"))
                        .append("\", \"date\":\"").append(rs.getString("appointment_datetime"))
                        .append("\", \"faculty\":\"").append(rs.getString("faculty_name"))
                        .append("\", \"status\":\"").append(rs.getString("status"))
                        .append("\"},");

            }

            if (json.length() > 1) json.setLength(json.length() - 1); // Remove last comma
            json.append("]");

            out.print(json.toString());
        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().write("{\"success\": false, \"message\": \"Server error\"}");
        }
    }

}