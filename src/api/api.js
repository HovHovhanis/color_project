import axios from 'axios';

const API_URL = 'https://64e4e0a5c55563802913d96b.mockapi.io/products'; // Пример. Замени на свой URL!

export async function getProducts() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    return [];
  }
}
