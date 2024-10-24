package sever;

import org.java_websocket.WebSocket;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;

public class FileUploadService {

    private static final String UPLOAD_DIR = "D:\\PBL4\\fileseverPBL4"; // Thư mục lưu file upload

    public void handleFileUpload(WebSocket conn, String data) {
        try {
            // Dữ liệu file được mã hóa Base64 (gửi từ client)
            String[] fileParts = data.split(",", 2); // Format: "fileName,base64Data"
            if (fileParts.length != 2) {
                conn.send("Invalid file format.");
                return;
            }

            String fileName = fileParts[0];
            String base64FileData = fileParts[1];

            // Giải mã Base64 thành byte
            byte[] fileData = Base64.getDecoder().decode(base64FileData);

            // Tạo thư mục nếu chưa tồn tại
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // Lưu file vào thư mục
            File file = new File(UPLOAD_DIR + "\\" + fileName);
            try (FileOutputStream fos = new FileOutputStream(file)) {
                fos.write(fileData);
            }

            conn.send("File uploaded successfully: " + fileName);
        } catch (IOException e) {
            conn.send("Error uploading file.");
            e.printStackTrace();
        }
    }
}
