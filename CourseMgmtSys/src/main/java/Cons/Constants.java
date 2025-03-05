package Cons;

public class Constants {
    // Database Credentials
    public static final String DB_URL = "jdbc:mysql://localhost:3306/dbcollege?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    public static final String DB_USER = "root";
    public static final String DB_PASSWORD = "root123";

    // Servlet Endpoints
    public static final String AUTH_SERVLET = "/auth";
    public static final String COURSE_SERVLET = "/CourseServlet";
    public static final String USER_SERVLET = "/UserServlet";

    // JSON Response Keys
    public static final String SUCCESS = "success";
    public static final String ERROR = "error";
    public static final String MESSAGE = "message";

    // Authentication Strings
    public static final String USER_TYPE = "userType";
    public static final String EMAIL = "email";
    public static final String PASSWORD = "password";

    // Query Strings
    public static final String AUTH_QUERY = "SELECT * FROM users WHERE email = ? AND password = ? AND userType = ?";
    public static final String COURSE_SEARCH_QUERY = "SELECT course_id, course_name FROM courses WHERE course_id = ? OR course_name LIKE ?";
    public static final String COURSE_DETAILS_QUERY = "SELECT * FROM courses WHERE course_id = ?";
    public static final String PREREQUISITES_QUERY = "SELECT p.prerequisite_course_id, c.course_name FROM prerequisites p " +
            "JOIN courses c ON p.prerequisite_course_id = c.course_id WHERE p.course_id = ?";
    public static final String USER_DETAILS_QUERY = "SELECT u.name, u.email, u.user_id, " +
            "(SELECT student_id FROM students WHERE user_id = u.user_id LIMIT 1) AS student_id, " +
            "(SELECT faculty_id FROM faculty WHERE user_id = u.user_id LIMIT 1) AS faculty_id, " +
            "(SELECT department_name FROM students WHERE user_id = u.user_id LIMIT 1) AS student_department, " +
            "(SELECT department_name FROM faculty WHERE user_id = u.user_id LIMIT 1) AS faculty_department " +
            "FROM users u WHERE u.email = ?";

    // Error Messages
    public static final String INVALID_EMAIL = "{\"success\": false, \"message\": \"Invalid email\"}";
    public static final String USER_NOT_FOUND = "{\"success\": false, \"message\": \"User not found\"}";
    public static final String SERVER_ERROR = "{\"success\": false, \"message\": \"Server error\"}";
    public static final String COURSE_NOT_FOUND = "{\"error\": \"Course not found\"}";

    // Logging Messages
    public static final String NO_COURSES_FOUND = "🔴 No courses found for search: ";
}
