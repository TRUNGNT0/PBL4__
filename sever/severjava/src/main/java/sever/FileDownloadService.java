package sever;

import org.java_websocket.WebSocket;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;

public class FileDownloadService {

    private static final String UPLOAD_DIR = "D:\\PBL4\\fileseverPBL4"; // Thư mục lưu file upload

    public void handleFileDownload(WebSocket conn, String fileName) {
        try {
            // Tạo đối tượng File từ đường dẫn đầy đủ
            File file = new File(UPLOAD_DIR + "\\" + fileName);

            // Kiểm tra xem file có tồn tại không
            if (!file.exists()) {
                conn.send("File not found: " + fileName);
                return;
            }

            // Đọc nội dung file thành byte
            byte[] fileData = Files.readAllBytes(file.toPath());

            // Mã hóa dữ liệu file bằng Base64
            String base64FileData = Base64.getEncoder().encodeToString(fileData);

            // Gửi lại cho client với định dạng "download:fileName,base64Data"
            conn.send("download:" + fileName + "," + base64FileData);
        } catch (IOException e) {
            conn.send("Error downloading file: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
