// server/helpers/phone.helper.js
// Các hàm hỗ trợ định dạng dữ liệu điện thoại và cấu hình phần cứng

export const FALLBACK_IMG = 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg';

export function detectCategory(name = '') {
  const upper = String(name).toUpperCase();
  if (upper.includes('IPHONE') || upper.includes('APPLE')) return 'APPLE';
  if (upper.includes('SAMSUNG') || upper.includes('GALAXY')) return 'SAMSUNG';
  if (upper.includes('XIAOMI') || upper.includes('REDMI')) return 'XIAOMI';
  if (upper.includes('ROG') || upper.includes('REDMAGIC') || upper.includes('NUBIA') || upper.includes('GAMING')) return 'GAMING';
  return 'FLAGSHIP';
}

export function formatPhoneRow(p, extraUrls = []) {
  const coverUrl = (p.MacDinh && String(p.MacDinh).trim()) ? p.MacDinh : FALLBACK_IMG;
  const uniqueAlbum = Array.from(new Set([coverUrl, ...extraUrls].filter(Boolean)));
  const cat = detectCategory(p.TenDienThoai);
  const upperName = String(p.TenDienThoai || '').toUpperCase();
  const brand = cat === 'GAMING' && upperName.includes('ASUS') ? 'ASUS' : (cat === 'GAMING' && upperName.includes('NUBIA') ? 'NUBIA' : cat);

  return {
    maDienThoai: Number(p.maDienThoai),
    TenDienThoai: p.TenDienThoai,
    hangSanXuat: brand,
    category: cat,
    isHot: Number(p.maDienThoai) > 11 || Number(p.maDienThoai) <= 4 || Number(p.maDienThoai) === 10,
    isFeatured: true,
    SoIMEI_Serial: p.SoIMEI_Serial || '',
    TinhTrangMay: p.TinhTrangMay || 'SAN_SANG',
    TinhTrangMayText: p.TinhTrangMay === 'SAN_SANG' ? 'Sẵn sàng thuê' : (p.TinhTrangMay === 'BAO_TRI' ? 'Bảo trì' : 'Đang cho thuê'),
    SoLuong: Number(p.SoLuong ?? 1),
    MacDinh: coverUrl,
    hinhAnh: uniqueAlbum,
    giaThueNgay: Number(p.giaThueNgay),
    giaKhuyenMai: p.giaKhuyenMai ? Number(p.giaKhuyenMai) : null,
    tienCocYeuCau: Number(p.tienCocYeuCau),
    cauHinh: {
      MaCauHinh: p.MaCauHinh || '',
      Chipset: p.Chipset || 'Đang cập nhật',
      RAM_ROM: p.RAM_ROM || '8GB / 256GB',
      HeDieuHanh: p.HeDieuHanh || 'iOS / Android',
      ThongSoCamera_Pin: p.ThongSoCamera_Pin || ''
    },
    moTa: p.ThongSoCamera_Pin || `${p.TenDienThoai} - ${p.Chipset || ''}, ${p.RAM_ROM || ''}`
  };
}
