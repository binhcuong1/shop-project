const tbody = document.getElementById("tbody");
const grand = document.getElementById("grand");

function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  console.table(cart);
  tbody.innerHTML = "";
  let total = 0;

  cart.forEach((p, i) => {
    const tr = document.createElement("tr");
    const subtotal = p.price * p.qty;
    total += subtotal;
    tr.innerHTML = `
      <td>${p.name}</td>
      <td class="text-end">${p.price.toLocaleString()} đ</td>
      <td class="text-center">
        <input type="number" min="1" value="${p.qty}" data-index="${i}" class="form-control form-control-sm text-center qty-input">
      </td>
      <td class="text-end">${subtotal.toLocaleString()} đ</td>
      <td class="text-end"><button class="btn btn-sm btn-danger" onclick="removeItem(${i})">X</button></td>`;
    tbody.appendChild(tr);
  });

  grand.textContent = total.toLocaleString() + " đ";
}

function removeItem(i) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// cập nhật số lượng
tbody?.addEventListener("change", (e) => {
  if (e.target.classList.contains("qty-input")) {
    const i = e.target.dataset.index;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart[i].qty = parseInt(e.target.value);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
  }
});

loadCart();
