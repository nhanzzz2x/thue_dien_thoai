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
  // Phân hệ Khách hàng (Client)
  { path: '/', name: 'Home', component: Home },
  { path: '/dien-thoai/:id', name: 'PhoneDetail', component: PhoneDetailPage, props: true },
  { path: '/lich-su-thue', name: 'RentalHistory', component: RentalHistory },
  {
    path: '/danh-muc/:category',
    name: 'CategoryPage',
    component: () => import('@/views/CategoryPage.vue'),
    props: true
  },
  { path: '/danh-muc', redirect: '/danh-muc/all' },

  // Phân hệ Quản trị (Admin)
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'don-thue', name: 'AdminOrders', component: OrderManagement },
      { path: 'dien-thoai', name: 'AdminPhones', component: PhoneManagement },
      { path: 'tien-coc', name: 'AdminDeposits', component: DepositManagement }
    ]
  },

  // Đường dẫn không tồn tại -> Về trang chủ
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  }
});

export default router;
