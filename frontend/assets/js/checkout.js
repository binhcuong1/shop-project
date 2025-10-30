const API_URL = "http://localhost:3000/api/orders";
const token = localStorage.getItem("token");

async function checkout() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!cart.length) return alert("Giỏ hàng trống!");

    const body = {
        items: cart.map(p => ({
            product: p._id || p.id,   // dùng id của sản phẩm
            quantity: p.qty,
            unitPrice: p.price
        }))
    };

    // console.table(cart); return;
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    if (data.success) {
        alert("Đặt hàng thành công!");
        localStorage.removeItem("cart");
        window.location = "../index.html";
    } else {
        alert("Lỗi: " + (data.message || "Không thể đặt hàng"));
    }
}
