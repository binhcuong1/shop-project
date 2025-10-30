const API_BASE = 'http://localhost:3000';
const esc = s => String(s ?? '').replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
const fmt = n => (n ?? 0).toLocaleString('vi-VN') + ' đ';

const q = new URLSearchParams(location.search);
const id = q.get('id');

const alertBox = document.getElementById('alertBox');
function showAlert(type, msg) {
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = msg;
    alertBox.classList.remove('d-none');
}

async function load() {
    if (!id) { showAlert('warning', 'Thiếu tham số id'); return; }
    try {
        const res = await fetch(`${API_BASE}/api/products/${id}`);
        
        const json = await res.json();
        if (!res.ok || !json?.data) { showAlert('danger', 'Không tìm thấy sản phẩm'); return; }
        const p = json.data;
        document.getElementById('pName').textContent = p.name || 'Không tên';
        document.getElementById('pPrice').textContent = fmt(p.price);
        document.getElementById('pStock').textContent = p.stock ?? 0;
        document.getElementById('pDesc').textContent = p.description || 'Không có mô tả';
    } catch (e) {
        console.error(e);
        showAlert('danger', 'Lỗi tải dữ liệu');
    }
}

load();
