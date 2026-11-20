// server/helpers/rental.helper.js
// Các hàm hỗ trợ định dạng phương thức cọc và dòng thời gian tiến trình đơn thuê

export function mapMethodText(method, rawText) {
  if (rawText) return rawText;
  if (method === 'CHUYEN_KHOAN') return 'Chuyển khoản 100% qua Ngân hàng';
  if (method === 'MAY_ANH_MAY_TINH') return 'Thế chân thiết bị công nghệ (Laptop / iPad)';
  return 'CCCD gắn chip + Cọc tiền mặt 15%';
}

export function buildStatusTimeline(o) {
  const createdStr = String(o.ngayTao || '').slice(0, 16);
  const st = o.MaTrangThai;
  const logs = [{ time: createdStr, title: 'Đặt đơn thuê thành công', desc: `Hình thức thế chân: ${o.TinhTrangCoc || 'CCCD gắn chip'}` }];

  if (['DA_XAC_NHAN_COC', 'DANG_THUE', 'DA_TRA_MAY', 'HOAN_TAT_TRA_COC'].includes(st)) {
    logs.push({ time: createdStr, title: 'Đã xác nhận hồ sơ đặt cọc', desc: `Mã phiếu cọc: ${o.MaChiTiet || 'N/A'} (${Number(o.SoTienCoc || 0).toLocaleString('vi-VN')} ₫)` });
  }
  if (['DANG_THUE', 'DA_TRA_MAY', 'HOAN_TAT_TRA_COC'].includes(st)) {
    logs.push({ time: createdStr, title: 'Đã bàn giao máy cho khách thuê', desc: o.TinhTrangLucGiao || 'Máy nguyên tem niêm phong, đầy đủ phụ kiện' });
  }
  if (['DA_TRA_MAY', 'HOAN_TAT_TRA_COC'].includes(st)) {
    logs.push({ time: o.NgayTra ? String(o.NgayTra).slice(0, 16) : createdStr, title: 'Khách đã mang trả thiết bị', desc: o.TinhTrangLucTra || 'Đang thẩm định ngoại quan và kiểm tra IMEI' });
  }
  if (st === 'HOAN_TAT_TRA_COC') {
    logs.push({ time: o.NgayTra ? String(o.NgayTra).slice(0, 16) : createdStr, title: 'Hoàn tất thanh lý Hợp đồng & Hoàn trả cọc', desc: 'Đã hoàn trả đầy đủ tiền cọc / tài sản thế chân' });
  }
  if (st === 'DA_HUY') {
    logs.push({ time: createdStr, title: 'Đơn thuê đã hủy', desc: o.TinhTrangLucTra || 'Đơn thuê đã bị hủy trên hệ thống' });
  }
  return logs;
}
