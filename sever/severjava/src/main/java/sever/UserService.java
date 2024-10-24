package sever;

import org.java_websocket.WebSocket;

import java.io.File;
import java.sql.*;

public class UserService {
    private Connection connection;

    public UserService() {
        connectToDatabase(); // Kết nối MySQL khi khởi tạo UserService
    }

    private void connectToDatabase() {
        try {
            String url = "jdbc:mysql://localhost:3306/PBL4";
            String user = "root"; // Thay thế bằng tài khoản MySQL của bạn
            String password = ""; // Thay thế bằng mật khẩu MySQL của bạn
            connection = DriverManager.getConnection(url, user, password);
            System.out.println("Connected to MySQL database.");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void handleLogin(WebSocket conn, String data) {
        String[] credentials = data.split(",");
        if (credentials.length == 2) {
            String email = credentials[0];
            String password = credentials[1];

            try {
                String query = "SELECT * FROM user WHERE email = ? AND password = ?";
                PreparedStatement statement = connection.prepareStatement(query);
                statement.setString(1, email);
                statement.setString(2, password);
                ResultSet resultSet = statement.executeQuery();

                if (resultSet.next()) {
                    conn.send("Login successful!");
                } else {
                    conn.send("Invalid email or password.");
                }
            } catch (SQLException e) {
                e.printStackTrace();
                conn.send("Error during login.");
            }
        } else {
            conn.send("Invalid login format.");
        }
    }

    public void handleSignup(WebSocket conn, String data) {
        String[] signupData = data.split(",");
        if (signupData.length == 4) {
            String username = signupData[0];
            String email = signupData[1];
            String phone = signupData[2];
            String password = signupData[3];

            try {
                // Kiểm tra xem email hoặc username đã tồn tại chưa
                String checkQuery = "SELECT * FROM user WHERE username = ? OR email = ?";
                PreparedStatement checkStatement = connection.prepareStatement(checkQuery);
                checkStatement.setString(1, username);
                checkStatement.setString(2, email);
                ResultSet checkResult = checkStatement.executeQuery();

                if (checkResult.next()) {
                    conn.send("Username or email already registered.");
                } else {
                    // Thêm thông tin người dùng vào database
                    String insertQuery = "INSERT INTO user (username, email, phone, password) VALUES (?, ?, ?, ?)";
                    PreparedStatement insertStatement = connection.prepareStatement(insertQuery);
                    insertStatement.setString(1, username);
                    insertStatement.setString(2, email);
                    insertStatement.setString(3, phone);
                    insertStatement.setString(4, password);
                    insertStatement.executeUpdate();

                    // Tạo thư mục cho người dùng
                    createUserDirectory(email);

                    conn.send("Signup successful!");
                }
            } catch (SQLException e) {
                e.printStackTrace();
                conn.send("Error during signup.");
            }
        } else {
            conn.send("Invalid signup format.");
        }
    }

    // Hàm tạo thư mục cho người dùng
    private void createUserDirectory(String email) {
        String userDirectoryPath = "D:\\PBL4\\fileseverPBL4" + email; // Thay đổi đường dẫn nếu cần
        File userDirectory = new File(userDirectoryPath);
        if (!userDirectory.exists()) {
            if (userDirectory.mkdirs()) {
                System.out.println("User directory created: " + userDirectoryPath);
            } else {
                System.out.println("Failed to create user directory: " + userDirectoryPath);
            }
        } else {
            System.out.println("User directory already exists: " + userDirectoryPath);
        }
    }
}
