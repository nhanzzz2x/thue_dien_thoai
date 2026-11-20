// server/controllers/category.controller.js
// Xử lý logic danh mục phân loại điện thoại và thương hiệu

export function getCategories(req, res) {
  res.json([
    { id: 'ALL', name: 'Tất cả điện thoại', icon: 'fa-mobile-screen-button' },
    { id: 'APPLE', name: 'Apple iPhone', icon: 'fa-apple' },
    { id: 'SAMSUNG', name: 'Samsung Galaxy', icon: 'fa-android' },
    { id: 'XIAOMI', name: 'Xiaomi & Redmi', icon: 'fa-bolt' },
    { id: 'GAMING', name: 'Gaming Phone (ROG, RedMagic)', icon: 'fa-gamepad' },
    { id: 'FLAGSHIP', name: 'Flagship Cao Cấp', icon: 'fa-crown' }
  ]);
}
