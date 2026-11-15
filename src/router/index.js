// ============================================================================================
// VIETNAMESE: CẤU HÌNH ĐỊNH TUYẾN VUE ROUTER CHO HỆ THỐNG CHO THUÊ ĐIỆN THOẠI
// ENGLISH: VUE ROUTER CONFIGURATION FOR PHONE RENTAL SYSTEM
// MAPPING: Định tuyến khách hàng (Giai đoạn 1) & Quản trị Admin (Giai đoạn 2)
// ============================================================================================

import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import PhoneDetailPage from '@/views/PhoneDetailPage.vue';
import RentalHistory from '@/views/RentalHistory.vue';
import AdminLayout from '@/views/Admin/AdminLayout.vue';
import AdminDashboard from '@/components/Admin/AdminDashboard.vue';
import PhoneManagement from '@/components/Admin/PhoneManagement.vue';
import OrderManagement from '@/components/Admin/OrderManagement.vue';
import DepositManagement from '@/components/Admin/DepositManagement.vue';

const routes = [
  // ==========================================================================================
  // VIETNAMESE: TUYẾN ĐƯỜNG DÀNH CHO KHÁCH HÀNG (CLIENT ROUTES - GIAI ĐOẠN 1)
  // ENGLISH: CUSTOMER FACING ROUTES (PHASE 1)
  // ==========================================================================================
  {
    // Trang chủ: Bộ lọc, danh sách điện thoại, thế chân & ưu đãi
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    // Trang chi tiết điện thoại: Thông số kỹ thuật, tính tiền thuê, cọc & thêm vào giỏ
    path: '/dien-thoai/:id',
    name: 'PhoneDetail',
    component: PhoneDetailPage,
    props: true
  },
  {
    // Trang lịch sử đơn thuê: Tiến trình duyệt đơn 5 bước, xem hợp đồng & hủy đơn
    path: '/lich-su-thue',
    name: 'RentalHistory',
    component: RentalHistory
  },
  {
    // Trang danh mục điện thoại theo hãng/phân khúc (Load trang mới, không trượt trang)
    path: '/danh-muc/:category',
    name: 'CategoryPage',
    component: () => import('@/views/CategoryPage.vue'),
    props: true
  },
  {
    path: '/danh-muc',
    redirect: '/danh-muc/all'
  },

  // ==========================================================================================
  // VIETNAMESE: TUYẾN ĐƯỜNG DÀNH CHO QUẢN TRỊ VIÊN (ADMIN ROUTES - GIAI ĐOẠN 2)
  // ENGLISH: ADMIN PORTAL ROUTES (PHASE 2)
  // ==========================================================================================
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        // 1. Bảng điều khiển tổng quan (Dashboard KPIs)
        path: '',
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        // 2. Duyệt đơn thuê theo quy trình 5 bước máy trạng thái
        path: 'don-thue',
        name: 'AdminOrders',
        component: OrderManagement
      },
      {
        // 3. Quản lý kho máy, mã IMEI và cấu hình phần cứng
        path: 'dien-thoai',
        name: 'AdminPhones',
        component: PhoneManagement
      },
      {
        // 4. Quản lý tiền cọc và tài sản thế chấp
        path: 'tien-coc',
        name: 'AdminDeposits',
        component: DepositManagement
      }
    ]
  },

  // ==========================================================================================
  // VIETNAMESE: XỬ LÝ ĐƯỜNG DẪN KHÔNG TỒN TẠI (404 CATCH-ALL) -> CHUYỂN VỀ TRANG CHỦ
  // ENGLISH: 404 NOT FOUND WILDCARD ROUTE -> REDIRECT TO HOME
  // ==========================================================================================
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Tự động đưa về đầu trang khi chuyển trang mới (không trượt cuộn)
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  }
});

export default router;
