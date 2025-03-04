import java.io.BufferedReader;
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
import org.json.JSONObject;

@WebServlet("/auth")
public class AuthServlet extends HttpServlet {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/dbcollege?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String DB_USER = "root"; // Change if needed
    private static final String DB_PASSWORD = "Siri@1234"; // Change if needed

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        JSONObject jsonResponse = new JSONObject();

        try {
            // Read JSON input
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            JSONObject jsonData = new JSONObject(sb.toString());

            String userType = jsonData.getString("userType");
            String email = jsonData.getString("email");
            String password = jsonData.getString("password");

            // Load MySQL JDBC Driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Connect to database
            Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
            String query = "SELECT * FROM users WHERE email = ? AND password = ? AND userType = ?";
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setString(1, email);
            stmt.setString(2, password);
            stmt.setString(3, userType);

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                jsonResponse.put("success", true);
            } else {
                jsonResponse.put("success", false);
            }

            conn.close();
        } catch (Exception e) {
            jsonResponse.put("success", false);
            jsonResponse.put("error", e.getMessage());
        }

        out.print(jsonResponse.toString());
        out.flush();
    }
}
