// Tệp upload.js

// Khởi tạo kết nối WebSocket
const socket = new WebSocket('ws://localhost:7070');

socket.onopen = function() {
    console.log('WebSocket connection established.');
};

socket.onmessage = function(event) {
    const message = event.data;
    handleServerMessage(message);
};

// Biến lưu trữ số lượng file đã upload
let totalFilesToUpload = 0;
let uploadedFilesCount = 0;

// Xử lý upload file
document.getElementById('uploadBtn').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const files = event.target.files;
    totalFilesToUpload = files.length; // Cập nhật số lượng file
    uploadedFilesCount = 0; // Đặt lại số lượng file đã upload

    for (const file of files) {
        addFileCard(file.name);
        uploadFile(file); // Gọi hàm uploadFile để tải lên file
    }
});

function addFileCard(fileName) {
    const fileGrid = document.getElementById('fileGrid');
    const fileCard = document.createElement('div');
    fileCard.className = 'file-card';
    fileCard.innerHTML = `
        <span class="file-name">${fileName}</span>
        <div>
            <button class="btn btn-success btn-sm" onclick="downloadFile('${fileName}')">Download</button>
            <button class="btn btn-danger btn-sm" onclick="deleteFile(this)">Delete</button>
        </div>
    `;
    fileGrid.appendChild(fileCard);
}

function uploadFile(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const base64Data = event.target.result.split(',')[1]; // Lấy dữ liệu base64
        // Gửi yêu cầu upload tới server
        const message = `upload:${file.name},${base64Data}`;
        socket.send(message);
    };
    reader.readAsDataURL(file);
}

// Hàm này sẽ được gọi khi một file được upload thành công
function onFileUploaded() {
    uploadedFilesCount++; // Tăng số lượng file đã upload
    if (uploadedFilesCount === totalFilesToUpload) {
        // Nếu đã upload tất cả các file, đóng kết nối WebSocket
        socket.close();
        console.log('All files uploaded, WebSocket connection closed.');
    }
}

function handleServerMessage(message) {
    // Nếu server gửi phản hồi về việc upload thành công, gọi hàm onFileUploaded
    if (message.startsWith("upload_success:")) {
        onFileUploaded();
    } else {
        alert(message); // Xử lý thông điệp khác từ server
    }
}
