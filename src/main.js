import './assets/scss/main.scss';
import { loadProducts } from './components/products/productCard.js';
import { initHeroSlider } from './components/hero/hero.js';
import { initHeader } from './components/header/header.js'
import { initCart } from './components/cart/cart.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initHeader();
  loadProducts(); 
  initCart();
});
