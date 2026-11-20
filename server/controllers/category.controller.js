// server/controllers/category.controller.js
// Xử lý logic danh mục phân loại điện thoại và thương hiệu

export function getCategories(req, res) {
  res.json([
    { id: 'ALL', name: 'Tất cả điện thoại', icon: 'fa-mobile' },
    { id: 'APPLE', name: 'Apple iPhone', icon: 'fa-apple' },
    { id: 'SAMSUNG', name: 'Samsung Galaxy', icon: 'fa-android' },
    { id: 'OPPO', name: 'OPPO', icon: 'fa-mobile' },
    { id: 'XIAOMI', name: 'Xiaomi & Redmi', icon: 'fa-bolt' },
    { id: 'VIVO', name: 'Vivo', icon: 'fa-mobile' },
    { id: 'REALME', name: 'Realme', icon: 'fa-mobile' },
    { id: 'GAMING', name: 'Gaming Phone (ROG, RedMagic)', icon: 'fa-gamepad' },
    { id: 'GOOGLE', name: 'Google Pixel', icon: 'fa-google' },
    { id: 'SONY', name: 'Sony Xperia', icon: 'fa-mobile' },
    { id: 'OTHER', name: 'Hãng Khác', icon: 'fa-tag' }
  ]);
}
