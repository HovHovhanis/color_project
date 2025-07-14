import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

export function initHeroSlider() {
  new Swiper('.swiper', {
    loop: true,
    pagination: {
      el: '.swiper-pagination', // именно тут рисуются точки
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
  });
}
