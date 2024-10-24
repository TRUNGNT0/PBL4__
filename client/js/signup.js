document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.querySelector("form");

    signupForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Ngăn chặn form submit mặc định

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Kiểm tra các trường nhập liệu có đầy đủ không
        if (!username || !email || !phone || !password || !confirmPassword) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        // Kiểm tra định dạng email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Vui lòng nhập địa chỉ email hợp lệ.");
            return;
        }

        // Kiểm tra định dạng số điện thoại (chỉ cho phép số)
        const phonePattern = /^[0-9]{10}$/; // Mẫu cho số điện thoại 10 chữ số
        if (!phonePattern.test(phone)) {
            alert("Vui lòng nhập số điện thoại hợp lệ.");
            return;
        }

        // Kiểm tra độ dài mật khẩu (ít nhất 6 ký tự)
        if (password.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        // Kiểm tra mật khẩu xác nhận
        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp.");
            return;
        }

        // Tạo socket kết nối tới server
        const socket = new WebSocket('ws://localhost:7070');

        socket.onopen = function() {
            console.log("Connected to server");

            // Gửi thông điệp đăng ký dưới dạng chuỗi "signup:username,email,phone,password"
            const signupData = `signup:${username},${email},${phone},${password}`;
            socket.send(signupData);
        };

        socket.onmessage = function(event) {
            // Nhận phản hồi từ server
            alert(event.data);

            // Kiểm tra thông báo từ server để chuyển hướng
            if (event.data === "Signup successful!") {
                window.location.href = "../html/login.htm"; // Chuyển hướng về trang login
            } else {
                console.log("Signup failed");
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
