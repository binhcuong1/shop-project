const API_URL = "http://localhost:3000/api/auth";

const regForm = document.getElementById("registerForm");
const logForm = document.getElementById("loginForm");
const msg = document.getElementById("msg");

if (regForm) {
    regForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const body = {
            username: document.getElementById("username").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.success) {
            msg.classList.replace("text-danger", "text-success");
            msg.textContent = "Đăng ký thành công! Chuyển đến đăng nhập...";
            setTimeout(() => (window.location = "./login.html"), 1500);
        } else {
            msg.textContent = data.message || "Lỗi đăng ký";
        }
    });
}

if (logForm) {
    logForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const body = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        };

        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        const token = data.token;

        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload?.role) localStorage.setItem("role", payload.role);

        if (data.success) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            localStorage.setItem("username", data.data.username);
            msg.classList.replace("text-danger", "text-success");
            msg.textContent = "Đăng nhập thành công! Chuyển về trang chủ...";
            setTimeout(() => (window.location = "../index.html"), 1500);
        } else {
            msg.textContent = data.message || "Sai thông tin đăng nhập";
        }
    });
}
