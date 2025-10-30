const API = "http://localhost:3000/api/orders";
const token = localStorage.getItem("token");

if (!token) {
    alert("Bạn cần đăng nhập để xem đơn hàng.");
    location.href = "../auth/login.html";
}

const badge = (status) => {
    const map = { pending: "warning", completed: "success", cancelled: "secondary" };
    return `<span class="badge text-bg-${map[status] || "light"} text-uppercase">${status}</span>`;
};

async function loadMyOrders() {
    try {
        const res = await fetch(`${API}/my`, { headers: { Authorization: "Bearer " + token } });
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Load orders failed");

        const tbody = document.getElementById("orderBody");
        const empty = document.getElementById("emptyBox");
        tbody.innerHTML = "";

        if (!json.data.length) {
            empty.classList.remove("d-none");
            return;
        } else empty.classList.add("d-none");
        console.table(json);
        json.data.forEach(o => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td class="text-monospace">${o._id}</td>
        <td class="text-center">${badge(o.status)}</td>
        <td class="text-end">${(o.totalAmount || 0).toLocaleString()} đ</td>
        <td class="text-center">${new Date(o.createdAt).toLocaleString()}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-info" onclick="viewDetails('${o._id}')">Xem</button>
        </td>
      `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error(e);
        alert("Không tải được đơn hàng.");
    }
}

async function viewDetails(orderId) {
    try {
        const res = await fetch(`${API}/${orderId}/my-details`, {
            headers: { Authorization: "Bearer " + token }
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Load details failed");

        const { order, details } = json.data;
        const body = document.getElementById("detailBody");
        body.innerHTML = `
      <div class="mb-2">Mã đơn: <code>${order._id}</code></div>
      <div class="mb-2">Trạng thái: ${badge(order.status)}</div>
      <hr class="my-2">
      ${details.map(d =>
            `<div class="d-flex justify-content-between border-bottom py-1">
          <div>${d.product?.name || "Sản phẩm"}</div>
          <div>SL: ${d.quantity} × ${d.unitPrice.toLocaleString()} đ</div>
        </div>`
        ).join("")}
      <hr class="my-2">
      <div class="text-end fw-bold">Tổng: ${(order.totalAmount || 0).toLocaleString()} đ</div>
    `;
        new bootstrap.Modal(document.getElementById("detailModal")).show();
    } catch (e) {
        console.error(e);
        alert("Không tải được chi tiết đơn.");
    }
}

loadMyOrders();
