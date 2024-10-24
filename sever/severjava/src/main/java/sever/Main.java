package sever;

import org.java_websocket.server.WebSocketServer;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;

import java.net.InetSocketAddress;

public class Main extends WebSocketServer {

    private UserService userService;
    private FileUploadService fileUploadService;
    private FileDownloadService fileDownloadService;

    public static void main(String[] args) {
        new Main(new InetSocketAddress(7070)).start();
        System.out.println("WebSocket server started on port 7070");
    }

    public Main(InetSocketAddress address) {
        super(address);
        userService = new UserService(); // Khởi tạo UserService
        fileUploadService = new FileUploadService(); // Khởi tạo FileUploadService
        fileDownloadService = new FileDownloadService(); // Khởi tạo FileDownloadService
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        System.out.println("New connection from " + conn.getRemoteSocketAddress());
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        System.out.println("Closed connection to " + conn.getRemoteSocketAddress());
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        // Kiểm tra xem client gửi lệnh gì: đăng nhập, đăng ký, upload hay download
        String[] parts = message.split(":", 2); // Format: "COMMAND:data"
        if (parts.length != 2) {
            conn.send("Invalid message format.");
            return;
        }

        String command = parts[0];
        String data = parts[1];

        switch (command) {
            case "login":
                userService.handleLogin(conn, data);
                break;
            case "signup":
                userService.handleSignup(conn, data);
                break;
            case "upload":
                fileUploadService.handleFileUpload(conn, data); // Xử lý upload
                break;
            case "download":
                fileDownloadService.handleFileDownload(conn, data); // Xử lý download
                break;
            default:
                conn.send("Unknown command.");
                break;
        }
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        ex.printStackTrace();
    }

    @Override
    public void onStart() {
        System.out.println("Server started successfully!");
    }
}
