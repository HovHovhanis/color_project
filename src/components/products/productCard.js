import { addToCart } from '../cart/cart.js';

let allProducts = [];
let currentFilter = 'new';
let currentSort = 'expensive';

export async function loadProducts() {
  try {
    const res = await fetch('/assets/data/products.json');
    allProducts = await res.json();

    initFilterButtons();
    initCustomSelect();
    initMobileFilterToggle();

    updateProducts();
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
  }
}

function renderProducts(products) {
  const container = document.querySelector('.products__cards');
  if (!container) return;

  container.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('products__card');
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="products__card__image" />
      <h3 class="products__card__name">${product.name}</h3>
      <div class="products__card__add-btn">
        <p class="products__card__price">${product.price} ₽</p>
        <button class="products__card__add" data-id="${product.id}">${product.addToCartText}</button>
      </div>
    `;
    container.appendChild(card);
  });

  const countEl = document.querySelector('.products__count');
  if (countEl) {
    countEl.textContent = `${products.length} товаров`;
  }

  document.querySelectorAll('.products__card__add').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const product = allProducts.find(p => p.id == id);
      if (product) addToCart(product);
    });
  });
}

function filterProducts(type) {
  switch (type) {
    case 'new': return allProducts.filter(p => p.isNew);
    case 'inStock': return allProducts.filter(p => p.inStock);
    case 'contract': return allProducts.filter(p => p.isContract);
    case 'exclusive': return allProducts.filter(p => p.isExclusive);
    case 'sale': return allProducts.filter(p => p.onSale);
    case 'all': return allProducts;
    default: return allProducts;
  }
}

function sortProducts(sortType, products) {
  let sorted = [...products];

  switch (sortType) {
    case 'expensive':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'cheap':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'popular':
      sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      break;
    case 'newest':
      sorted.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
      break;
    default:
      break;
  }

  return sorted;
}

function updateProducts() {
  const filtered = filterProducts(currentFilter);
  const sorted = sortProducts(currentSort, filtered);
  renderProducts(sorted);
}

function initFilterButtons() {
  const buttons = document.querySelectorAll('.products__filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      updateProducts();
    });
  });
}

function initCustomSelect() {
  document.querySelectorAll('.custom-select').forEach(select => {
    const trigger = select.querySelector('.custom-select__trigger');
    const options = select.querySelectorAll('.custom-select__option');

    trigger.addEventListener('click', () => {
      select.classList.toggle('open');
    });

    options.forEach(option => {
      option.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        trigger.textContent = option.textContent;
        select.classList.remove('open');

        currentSort = option.dataset.value;
        updateProducts();
      });
    });

    document.addEventListener('click', e => {
      if (!select.contains(e.target)) {
        select.classList.remove('open');
      }
    });
  });
}

function initMobileFilterToggle() {
  const filterBtn = document.querySelector('.products__flitder-btn__mobile');
  const filterSidebar = document.querySelector('.products__filter');

  if (!filterBtn || !filterSidebar) return;

  filterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    filterSidebar.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!filterSidebar.contains(e.target) && e.target !== filterBtn) {
      filterSidebar.classList.remove('open');
    }
  });
}

