// Tệp download.js

// Khởi tạo kết nối WebSocket
const socket = new WebSocket('ws://localhost:7070');

socket.onopen = function() {
    console.log('WebSocket connection established for downloads.');
};

socket.onmessage = function(event) {
    const message = event.data;
    handleServerMessage(message);
};

function downloadFile(fileName) {
    alert(`Requesting download for ${fileName}`);
    // Gửi yêu cầu tải xuống tới server
    const message = `download:${fileName}`;
    socket.send(message);
}

function handleServerMessage(message) {
    if (message.startsWith("download:")) {
        const [_, fileName, base64Data] = message.split(",");
        const byteCharacters = atob(base64Data); // Giải mã dữ liệu base64
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteNumbers], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        
        // Tạo thẻ a để tải file xuống
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        alert(`Downloaded ${fileName}`);
    } else {
        alert(message); // Xử lý thông điệp khác từ server
    }
}
