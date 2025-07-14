let cart = [];

const cartSidebar = document.getElementById('cartSidebar');
const cartItemsContainer = cartSidebar.querySelector('.cart-sidebar__items');
const cartTotalEl = cartSidebar.querySelector('.cart-sidebar__total');
const cartCountEl = cartSidebar.querySelector('.cart-sidebar__count');
const cartCloseBtn = cartSidebar.querySelector('.cart-sidebar__close');
const cartClearBtn = cartSidebar.querySelector('.cart-sidebar__clear');
const cartButton = document.querySelector('.user-actions__cart');

export function addToCart(product) {
  const inCart = cart.find(item => item.id === product.id);
  if (inCart) {
    inCart.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartCount();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id.toString() !== productId.toString());
  updateCartCount();
  renderCart();
}


function updateCartCount() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartButton) cartButton.textContent = totalCount;
  if (cartCountEl) cartCountEl.textContent = `${totalCount} товар${totalCount === 1 ? '' : totalCount < 5 ? 'а' : 'ов'}`;
}

function renderCart() {
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Корзина пуста</p>';
    cartTotalEl.textContent = 'Итого: 0 ₽';
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const itemEl = document.createElement('div');
    itemEl.classList.add('cart-sidebar__item');
    itemEl.innerHTML = `
      <div class="cart-sidebar__item-left">
        <img src="${item.image}" alt="${item.name}" class="cart-sidebar__item-image" />
        <div class="cart-sidebar__item-info">
          <p class="cart-sidebar__item-name">${item.name}</p>
          <p class="cart-sidebar__item-price">${item.price} ₽</p>
          <div class="cart-sidebar__item-controls">
            <button class="cart-sidebar__item-decrease" data-id="${item.id}">-</button>
            <span class="cart-sidebar__item-quantity">${item.quantity}</span>
            <button class="cart-sidebar__item-increase" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
      <button class="cart-sidebar__item-remove" data-id="${item.id}" aria-label="Удалить ${item.name}">&times;</button>
    `;

    cartItemsContainer.appendChild(itemEl);
  });

  cartTotalEl.textContent = `Итого: ${total} ₽`;

  // Удаление товара
  cartItemsContainer.querySelectorAll('.cart-sidebar__item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      removeFromCart(id);
      console.log('Cart module initialized');
    });
  });

  // Уменьшение количества
  cartItemsContainer.querySelectorAll('.cart-sidebar__item-decrease').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = cart.find(p => p.id == id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          cart = cart.filter(p => p.id != id);
        }
        updateCartCount();
        renderCart();
      }
    });
  });

  // Увеличение количества
  cartItemsContainer.querySelectorAll('.cart-sidebar__item-increase').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = cart.find(p => p.id == id);
      if (item) {
        item.quantity += 1;
        updateCartCount();
        renderCart();
      }
    });
  });
}

function openCart() {
  renderCart();
  cartSidebar.classList.add('open');
  cartSidebar.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartSidebar.setAttribute('aria-hidden', 'true');
}

function clearCart() {
  cart = [];
  updateCartCount();
  renderCart();
}

export function initCart() {
  if (!cartButton || !cartSidebar || !cartCloseBtn) return;

  cartButton.addEventListener('click', () => {
    if (cartSidebar.classList.contains('open')) {
      closeCart();
    } else {
      openCart();
    }
  });

  cartCloseBtn.addEventListener('click', closeCart);
  cartClearBtn.addEventListener('click', clearCart);

  cartSidebar.addEventListener('click', e => {
    if (e.target === cartSidebar) closeCart();
  });
}
