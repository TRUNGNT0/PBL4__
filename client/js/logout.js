// Khi nhấn nút Logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    // Xóa thông tin phiên lưu trữ (nếu có)
    sessionStorage.clear();
    localStorage.clear();
    
    // Thay thế trạng thái lịch sử hiện tại bằng trang đăng nhập
    window.location.replace('../html/login.htm');
    
    // Sau khi điều hướng, sử dụng replaceState để không lưu trang trước
    window.history.replaceState(null, null, window.location.href);
    
    // Ngăn người dùng quay lại trang trước bằng cách vô hiệu hóa hành vi "Back"
    window.onpopstate = function () {
        window.history.go(1);
    };
});
