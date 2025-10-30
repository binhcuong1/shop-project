// ===== Config =====
const API_BASE = 'http://localhost:3000'; // đổi nếu backend khác cổng

// ===== State =====
let page = 1, limit = 6, totalPages = 1;
let keyword = '';
let cache = []; // dùng khi server chưa có phân trang

// ===== DOM =====
const grid = document.getElementById('grid');
const alertBox = document.getElementById('alertBox');
const searchBox = document.getElementById('searchBox');
const limitSel = document.getElementById('limitSel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

// ===== Helpers =====
const fmt = n => (n ?? 0).toLocaleString('vi-VN') + ' đ';
const esc = s => String(s ?? '').replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));

function showAlert(type, msg) {
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = msg;
    alertBox.classList.remove('d-none');
}

function hideAlert() { alertBox.classList.add('d-none'); }

function render(items) {
    grid.innerHTML = '';
    if (!items.length) {
        grid.innerHTML = `<div class="text-center text-muted py-5">Chưa có sản phẩm.</div>`;
        return;
    }
    const frag = document.createDocumentFragment();
    items.forEach(p => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-lg-4';
        col.innerHTML = `
  <div class="card h-100">
    <img src="https://picsum.photos/600/400?random=${Math.floor(Math.random() * 1000)}" class="card-img-top" alt="img">
    <div class="card-body">
      <h6 class="card-title mb-1">${esc(p.name)}</h6>
      <div class="small text-muted mb-2">Kho: ${p.stock ?? 0}</div>
      <div class="fw-bold text-danger mb-3">${fmt(p.price)}</div>
      <a class="btn btn-primary btn-sm me-2" href="./pages/product/product.html?id=${p._id}">Xem chi tiết</a>
      <button class="btn btn-outline-primary btn-sm"
        onclick='addToCart(${JSON.stringify({ _id: p._id, name: p.name, price: p.price }).replace(/"/g, "&quot;")})'>
        Thêm giỏ
      </button>
    </div>
  </div>`;

        frag.appendChild(col);
    });
    grid.appendChild(frag);
}

function updatePager() {
    pageInfo.textContent = `Trang ${page}/${totalPages}`;
    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= totalPages;
}

// client-side paginate (khi BE chưa có pagination)
function clientPaginate(arr) {
    const filtered = keyword ? arr.filter(x => (x.name || '').toLowerCase().includes(keyword.toLowerCase())) : arr;
    totalPages = Math.max(1, Math.ceil(filtered.length / limit));
    const start = (page - 1) * limit;
    render(filtered.slice(start, start + limit));
    updatePager();
}

function addToCart(p) {
    const key = 'cart';
    const cart = JSON.parse(localStorage.getItem(key) || '[]');
    const i = cart.findIndex(x => x.id === p._id);
    if (i >= 0) cart[i].qty += 1;
    else cart.push({ id: p._id, name: p.name, price: p.price, qty: 1 });
    localStorage.setItem(key, JSON.stringify(cart));
    alert('Đã thêm vào giỏ!');
}


// ===== Load =====
async function load() {
    hideAlert();
    try {
        // thử gọi dạng có query nếu bạn đã làm pagination ở BE
        const qs = new URLSearchParams({ page, limit, search: keyword });
        const res = await fetch(`${API_BASE}/api/products?${qs.toString()}`);
        const json = await res.json();

        if (res.ok && json?.pagination) { // BE có phân trang
            totalPages = json.pagination.totalPages || 1;
            render(json.data || []);
            updatePager();
        } else {
            // fallback: lấy full rồi phân trang client
            const res2 = await fetch(`${API_BASE}/api/products`);
            const all = await res2.json();
            cache = all?.data || [];
            clientPaginate(cache);
        }
    } catch (e) {
        console.error(e);
        showAlert('danger', 'Không tải được sản phẩm. Kiểm tra API backend & CORS.');
    }
}

// ===== Events =====
searchBox.addEventListener('input', () => { keyword = searchBox.value.trim(); page = 1; (cache.length ? clientPaginate(cache) : load()); });
limitSel.addEventListener('change', () => { limit = +limitSel.value || 6; page = 1; (cache.length ? clientPaginate(cache) : load()); });
prevBtn.addEventListener('click', () => { if (page > 1) { page--; (cache.length ? clientPaginate(cache) : load()); } });
nextBtn.addEventListener('click', () => { if (page < totalPages) { page++; (cache.length ? clientPaginate(cache) : load()); } });

// init
load();
