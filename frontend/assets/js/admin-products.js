const API_BASE = 'http://localhost:3000';

// DOM
const tbody = document.getElementById('tbody');
const alertBox = document.getElementById('alertBox');
const modalEl = document.getElementById('editModal');
const modal = new bootstrap.Modal(modalEl);

const fId = document.getElementById('id');
const fName = document.getElementById('name');
const fPrice = document.getElementById('price');
const fStock = document.getElementById('stock');
const fDesc = document.getElementById('description');
const modalTitle = document.getElementById('modalTitle');
const editForm = document.getElementById('editForm');
const btnCreate = document.getElementById('btnCreate');

const esc = s => String(s ?? '').replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
const fmt = n => (n ?? 0).toLocaleString('vi-VN') + ' đ';

function showAlert(type, msg) {
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = msg;
    alertBox.classList.remove('d-none');
    setTimeout(() => alertBox.classList.add('d-none'), 2500);
}

async function load() {
    const res = await fetch(`${API_BASE}/api/products`);
    const json = await res.json();
    const rows = (json.data || []).map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${esc(p.name)}</td>
      <td class="text-end">${fmt(p.price)}</td>
      <td class="text-center">${p.stock ?? 0}</td>
      <td>${esc(p.description || '')}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-warning me-1" onclick="edit('${p._id}')">Sửa</button>
        <button class="btn btn-sm btn-danger" onclick="removeP('${p._id}')">Xóa</button>
      </td>
    </tr>
  `).join('');
    tbody.innerHTML = rows || `<tr><td colspan="6" class="text-center text-muted py-4">Chưa có sản phẩm</td></tr>`;
}

btnCreate.addEventListener('click', () => {
    modalTitle.textContent = 'Thêm sản phẩm';
    fId.value = ''; fName.value = ''; fPrice.value = ''; fStock.value = '0'; fDesc.value = '';
});

async function edit(id) {
    const res = await fetch(`${API_BASE}/api/products/${id}`);
    const { data } = await res.json();
    modalTitle.textContent = 'Sửa sản phẩm';
    fId.value = data._id;
    fName.value = data.name;
    fPrice.value = data.price;
    fStock.value = data.stock ?? 0;
    fDesc.value = data.description || '';
    modal.show();
}

editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        name: fName.value.trim(),
        price: Number(fPrice.value),
        stock: Number(fStock.value || 0),
        description: fDesc.value.trim()
    };
    if (!body.name || isNaN(body.price)) { showAlert('warning', 'Vui lòng nhập tên và giá'); return; }
    
    const id = fId.value; 
    const url = id ? `${API_BASE}/api/products/${id}` : `${API_BASE}/api/products`;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) { showAlert('danger', 'Lưu thất bại'); return; }
    modal.hide();
    showAlert('success', 'Đã lưu');
    load();
});

async function removeP(id) {
    if (!confirm('Xóa (mềm) sản phẩm này?')) return;
    const res = await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) { showAlert('danger', 'Xóa thất bại'); return; }
    showAlert('success', 'Đã xóa');
    load();
}

load();
