document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Ngăn chặn form submit mặc định

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Kiểm tra xem email và mật khẩu có đầy đủ không
        if (email === "" || password === "") {
            alert("Vui lòng nhập đầy đủ email và mật khẩu.");
            return;
        }

        // Kiểm tra định dạng email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Vui lòng nhập địa chỉ email hợp lệ.");
            return;
        }

        // Tạo socket kết nối tới server
        const socket = new WebSocket('ws://localhost:7070');

        socket.onopen = function() {
            console.log("Connected to server");
            
            // Gửi thông điệp đăng nhập dưới dạng chuỗi "login:email,password"
            const credentials = `login:${email},${password}`;
            socket.send(credentials);
        };

        socket.onmessage = function(event) {
            // Nhận phản hồi từ server
            alert(event.data);

            // Kiểm tra thông báo từ server để chuyển hướng
            if (event.data === "Login successful!") {
                window.location.href = "../html/view.htm"; // Chuyển hướng đến trang view.htm
            } else {
                console.log("Login failed");
            }

            // Đóng kết nối sau khi nhận được phản hồi từ server
            socket.close();
        };

        socket.onerror = function(error) {
            alert("WebSocket error: " + error);
            socket.close(); // Đóng kết nối khi có lỗi
        };

        socket.onclose = function() {
            console.log("Connection closed");
        };
    });
});
