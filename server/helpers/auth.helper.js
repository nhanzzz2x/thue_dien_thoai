// server/helpers/auth.helper.js
// Các hàm hỗ trợ khởi tạo dữ liệu danh mục quyền hạn và phát hành mã phiên JWT / Refresh Token

export async function ensureAuthLookups(conn) {
  await conn.query("INSERT IGNORE INTO taikhoanlienket (maNhaCungCap, tenNhaCungCap) VALUES ('LOCAL', 'Tài khoản mật khẩu nội bộ'), ('GOOGLE', 'Google OAuth 2.0'), ('FACEBOOK', 'Facebook Login')");
  await conn.query("INSERT IGNORE INTO phanquyen (VaiTro, MoTa) VALUES ('ROLE_USER', 'Khách hàng thuê máy'), ('ROLE_ADMIN', 'Quản trị viên hệ thống')");
}

export async function issueTokensForUser(conn, maNguoiDung) {
  const rand = Math.floor(1000 + Math.random() * 9000);
  const accessToken = `JWT_${maNguoiDung}_${Date.now()}_${rand}`;
  const refreshToken = `RT_${maNguoiDung}_${Date.now()}_${rand}`;
  try {
    await conn.query('INSERT INTO usertoken (Token, MaNguoiDung, thoiGianKichHoat, thoiGianHetHan) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))', [accessToken, maNguoiDung]);
    await conn.query('DELETE FROM refreshtoken WHERE MaNguoiDung = ?', [maNguoiDung]);
    await conn.query('INSERT INTO refreshtoken (Token, MaNguoiDung, thoiGianHetHan) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))', [refreshToken, maNguoiDung]);
  } catch (e) {
    console.warn('Token log warning:', e.message);
  }
  return { accessToken, refreshToken };
}
