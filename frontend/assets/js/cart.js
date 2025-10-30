const key = 'cart', tbody = document.getElementById('tbody'), grand = document.getElementById('grand');
const fmt = n => (n ?? 0).toLocaleString('vi-VN') + ' đ';
function load() {
    const cart = JSON.parse(localStorage.getItem(key) || '[]');
    let total = 0;
    tbody.innerHTML = cart.map((x, i) => {
        const sub = x.price * x.qty; total += sub;
        return `<tr>
      <td>${x.name}</td>
      <td class="text-end">${fmt(x.price)}</td>
      <td class="text-center">
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-secondary" onclick="chg(${i},-1)">-</button>
          <span class="btn btn-light disabled">${x.qty}</span>
          <button class="btn btn-outline-secondary" onclick="chg(${i},1)">+</button>
        </div>
      </td>
      <td class="text-end">${fmt(sub)}</td>
      <td><button class="btn btn-sm btn-danger" onclick="del(${i})">Xóa</button></td>
    </tr>`;
    }).join('');
    grand.textContent = fmt(total);
}
function chg(i, d) { const c = JSON.parse(localStorage.getItem(key) || '[]'); c[i].qty = Math.max(1, c[i].qty + d); localStorage.setItem(key, JSON.stringify(c)); load(); }
function del(i) { const c = JSON.parse(localStorage.getItem(key) || '[]'); c.splice(i, 1); localStorage.setItem(key, JSON.stringify(c)); load(); }
load();
