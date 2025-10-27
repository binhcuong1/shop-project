// ==== CẤU HÌNH API ====
const API_BASE = 'http://localhost:3000'; // đổi nếu backend khác domain/port

// ==== STATE ====
const state = {
    page: 1,
    limit: 8,
    totalPages: 1,
    search: '',
    serverPagination: true,  // sẽ tự chuyển false nếu BE không trả pagination
    allDataCache: []         // dùng khi fallback client-side pagination
};

// ==== DOM ====
const grid = document.getElementById('grid');
const loading = document.getElementById('loading');
const alertBox = document.getElementById('alert');
const searchInput = document.getElementById('searchInput');
const limitSelect = document.getElementById('limitSelect');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

// ==== UTILS UI ====
function showLoading(show) {
    loading.classList.toggle('d-none', !show);
}

function showAlert(type, msg) {
    alertBox.className = 'alert alert-' + type;
    alertBox.textContent = msg;
}

function hideAlert() {
    alertBox.classList.add('d-none');
}

function fmtPrice(n) {
    return (n ?? 0).toLocaleString('vi-VN') + ' đ';
}

// ==== RENDER ====
function renderProducts(items) {
    grid.innerHTML = '';
    if (!items || items.length === 0) {
        grid.innerHTML = '<div class="text-center text-muted py-5">Không có sản phẩm</div>';
        return;
    }
    const frag = document.createDocumentFragment();

    items.forEach(p => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';

        const card = document.createElement('div');
        card.className = 'card h-100';
        card.innerHTML = `
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title mb-0">${escapeHtml(p.name || 'Không tên')}</h5>
              <div class="price">${fmtPrice(p.price)}</div>
            </div>
            <p class="card-text flex-grow-1">${escapeHtml(p.description || 'Không có mô tả')}</p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="muted">Tồn kho: ${p.stock ?? 0}</small>
              <span class="badge text-bg-light">#${p._id?.slice(-5) || 'id'}</span>
            </div>
          </div>
        `;
        col.appendChild(card);
        frag.appendChild(col);
    });

    grid.appendChild(frag);
}

function updatePaginationUI() {
    pageInfo.textContent = `Trang ${state.page} / ${state.totalPages}`;
    prevBtn.disabled = state.page <= 1;
    nextBtn.disabled = state.page >= state.totalPages;
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// ==== DATA LOADING ====
async function fetchFromServer(params) {
    // thử gọi BE theo dạng có query (search/page/limit)
    const q = new URLSearchParams({
        search: params.search || '',
        page: params.page || 1,
        limit: params.limit || 8,
        sort: 'createdAt',
        order: 'desc'
    });
    const url = `${API_BASE}/api/products?${q.toString()}`;

    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error('Fetch thất bại: ' + res.status);
    return res.json(); // kỳ vọng { success, data, pagination? }
}

function clientSidePaginate(all, page, limit, search) {
    const filtered = (search ? all.filter(x => (x.name || '').toLowerCase().includes(search.toLowerCase())) : all);
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);
    return { data, total, totalPages };
}

async function loadProducts() {
    hideAlert();
    showLoading(true);

    try {
        if (state.serverPagination) {
            const res = await fetchFromServer(state);
            const items = res?.data || [];

            // Nếu BE có pagination, dùng luôn; nếu không, fallback client-side
            if (res?.pagination && Number.isFinite(res.pagination.totalPages)) {
                state.totalPages = res.pagination.totalPages || 1;
                renderProducts(items);
            } else {
                // fallback: chuyển qua client-side pagination
                state.serverPagination = false;
                state.allDataCache = items;
                const { data, totalPages } = clientSidePaginate(state.allDataCache, state.page, state.limit, state.search);
                state.totalPages = totalPages;
                renderProducts(data);
            }
        } else {
            // client-side pagination (khi BE không trả pagination)
            // Nếu cache rỗng, tải tất cả dữ liệu 1 lần:
            if (state.allDataCache.length === 0) {
                const res = await fetch(`${API_BASE}/api/products`);
                const raw = await res.json();
                state.allDataCache = raw?.data || [];
            }
            const { data, totalPages } = clientSidePaginate(state.allDataCache, state.page, state.limit, state.search);
            state.totalPages = totalPages;
            renderProducts(data);
        }

        updatePaginationUI();
    } catch (err) {
        console.error(err);
        showAlert('danger', 'Không tải được sản phẩm. Kiểm tra API backend và CORS.');
    } finally {
        showLoading(false);
    }
}

// ==== EVENTS ====
function initEvents() {
    searchInput.addEventListener('input', () => {
        state.search = searchInput.value.trim();
        state.page = 1;
        loadProducts();
    });

    limitSelect.addEventListener('change', () => {
        state.limit = Number(limitSelect.value) || 8;
        state.page = 1;
        loadProducts();
    });

    prevBtn.addEventListener('click', () => {
        if (state.page > 1) {
            state.page -= 1;
            loadProducts();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (state.page < state.totalPages) {
            state.page += 1;
            loadProducts();
        }
    });
}

// ==== INIT ====
document.addEventListener('DOMContentLoaded', () => {
    initEvents();
    loadProducts();
});