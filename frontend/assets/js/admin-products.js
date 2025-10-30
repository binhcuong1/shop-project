// ============================
// admin-products.js
// ============================

const API_BASE = 'http://localhost:3000';
const tbody = document.querySelector('tbody');
const modal = new bootstrap.Modal(document.getElementById('editModal'));
const modalTitle = document.getElementById('modalTitle');
const editForm = document.getElementById('editForm');

const fId = document.getElementById('id');
const fName = document.getElementById('name');
const fPrice = document.getElementById('price');
const fStock = document.getElementById('stock');
const fDesc = document.getElementById('description');
const fImage = document.getElementById('image');
const imgPreview = document.getElementById('preview');

const btnCreate = document.getElementById('btnCreate');

// ========== Helper ==========
function fmt(x) {
    return Number(x || 0).toLocaleString('vi-VN');
}
function esc(s) {
    return (s || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}
function showAlert(type, msg) {
    const box = document.getElementById('alertBox');
    if (!box) return alert(msg);
    box.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
    setTimeout(() => (box.innerHTML = ''), 3000);
}

// ========== Load products ==========
async function load() {
    const res = await fetch(`${API_BASE}/api/products`);
    const json = await res.json();

    const rows = (json.data || []).map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>
        ${p.image ? `<img src="${API_BASE}${p.image}" alt="" style="height:48px" class="me-2 rounded">` : ''}
        <strong>${esc(p.name)}</strong>
      </td>
      <td class="text-end">${fmt(p.price)} đ</td>
      <td class="text-center">${p.stock ?? 0}</td>
      <td>${esc(p.description || '')}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-warning me-1" onclick="edit('${p._id}')">Sửa</button>
        <button class="btn btn-sm btn-danger" onclick="removeP('${p._id}')">Xóa</button>
      </td>
    </tr>
  `).join('');

    tbody.innerHTML =
        rows || `<tr><td colspan="6" class="text-center text-muted py-4">Chưa có sản phẩm</td></tr>`;
}
load();

// ========== Thêm mới ==========
btnCreate.addEventListener('click', () => {
    modalTitle.textContent = 'Thêm sản phẩm';
    fId.value = '';
    fName.value = '';
    fPrice.value = '';
    fStock.value = '0';
    fDesc.value = '';
    if (fImage) fImage.value = '';
    if (imgPreview) {
        imgPreview.src = '';
        imgPreview.classList.add('d-none');
    }
    modal.show();
});

// ========== Xem trước ảnh ==========
if (fImage) {
    fImage.addEventListener('change', () => {
        const file = fImage.files?.[0];
        if (!file) {
            imgPreview?.classList.add('d-none');
            return;
        }
        const url = URL.createObjectURL(file);
        imgPreview.src = url;
        imgPreview.classList.remove('d-none');
    });
}

// ========== Sửa sản phẩm ==========
async function edit(id) {
    const res = await fetch(`${API_BASE}/api/products/${id}`);
    const { data } = await res.json();

    modalTitle.textContent = 'Sửa sản phẩm';
    fId.value = data._id;
    fName.value = data.name;
    fPrice.value = data.price;
    fStock.value = data.stock ?? 0;
    fDesc.value = data.description || '';

    if (imgPreview) {
        if (data.image) {
            imgPreview.src = `${API_BASE}${data.image}`;
            imgPreview.classList.remove('d-none');
        } else {
            imgPreview.src = '';
            imgPreview.classList.add('d-none');
        }
    }

    if (fImage) fImage.value = '';
    modal.show();
}

// ========== Xóa sản phẩm ==========
async function removeP(id) {
    if (!confirm('Xóa sản phẩm này?')) return;
    const res = await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
        showAlert('success', 'Đã xóa');
        load();
    } else showAlert('danger', json.message || 'Lỗi khi xóa');
}

// ========== Lưu (thêm/sửa) ==========
editForm.addEventListener('submit', async e => {
    e.preventDefault();

    if (!fName.value.trim() || !fPrice.value) {
        showAlert('warning', 'Vui lòng nhập tên và giá');
        return;
    }

    const id = fId.value;
    const url = id ? `${API_BASE}/api/products/${id}` : `${API_BASE}/api/products`;
    const method = id ? 'PUT' : 'POST';

    // ✅ Dùng FormData để gửi text + file
    const fd = new FormData();
    fd.append('name', fName.value.trim());
    fd.append('price', String(Number(fPrice.value)));
    fd.append('stock', String(Number(fStock.value || 0)));
    fd.append('description', fDesc.value.trim());
    if (fImage && fImage.files && fImage.files[0]) {
        fd.append('image', fImage.files[0]);
    }

    const res = await fetch(url, { method, body: fd });
    const json = await res.json();

    if (json.success) {
        modal.hide();
        showAlert('success', 'Đã lưu thành công');
        load();
    } else {
        showAlert('danger', json.message || 'Lỗi khi lưu');
    }
});
