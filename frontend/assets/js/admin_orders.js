const API_BASE = "http://localhost:3000/api/orders/admin";
const token = localStorage.getItem("token");

async function loadOrders() {
    try {
        const res = await fetch(`${API_BASE}/all`, {
            headers: { Authorization: "Bearer " + token },
        });
        const data = await res.json();
        if (!data.success) return alert("Không thể tải danh sách đơn hàng!");
        renderOrders(data.data);
    } catch (err) {
        console.error(err);
        alert("Lỗi kết nối server!");
    }
}

function renderOrders(orders) {
    const tbody = document.getElementById("orderBody");
    tbody.innerHTML = "";
    console.table(orders);
    orders.forEach(o => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${o.user?.username || "(khách ẩn danh)"}</td>
      <td class="text-end">${o.totalAmount.toLocaleString()} đ</td>
      <td class="text-center">
        <select class="form-select form-select-sm statusSel" data-id="${o._id}">
          ${["pending", "completed", "cancelled"].map(st =>
            `<option value="${st}" ${st === o.status ? 'selected' : ''}>${st}</option>`
        ).join("")}
        </select>
      </td>
      <td class="text-center">${new Date(o.createdAt).toLocaleString()}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-info" onclick="viewDetails('${o._id}')">Xem</button>
      </td>`;
        tbody.appendChild(tr);
    });
}

// Thay đổi trạng thái
document.addEventListener("change", async (e) => {
    if (e.target.classList.contains("statusSel")) {
        const id = e.target.dataset.id;
        const status = e.target.value;
        try {
            await fetch(`${API_BASE}/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify({ status })
            });
        } catch (err) {
            alert("Lỗi cập nhật trạng thái!");
        }
    }
});

async function viewDetails(orderId) {
    try {
        const res = await fetch(`${API_BASE}/${orderId}/details`, {
            headers: { Authorization: "Bearer " + token }
        });
        const data = await res.json();
        if (!data.success) return alert("Không tải được chi tiết đơn!");
        const body = document.getElementById("detailBody");
        body.innerHTML = data.data.map(d =>
            `<div class="border-bottom py-1">${d.product?.name || "Sản phẩm"} - SL: ${d.quantity}, 
       Đơn giá: ${d.unitPrice.toLocaleString()}đ</div>`
        ).join("");
        new bootstrap.Modal(document.getElementById("detailModal")).show();
    } catch (err) {
        console.error(err);
    }
}

loadOrders();
