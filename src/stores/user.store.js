import { defineStore } from 'pinia';
import { AuthService } from '@/services/auth.service';

const USER_STORAGE_KEY = 'trongnhan_current_user';

function loadSavedSession() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email) return parsed;
    }
  } catch (e) {}
  return null;
}

export const useUserStore = defineStore('user', {
  state: () => {
    const savedUser = loadSavedSession();
    return {
      isLoggedIn: Boolean(savedUser),
      isAdmin: savedUser?.vaiTro === 'ADMIN' || savedUser?.role === 'ADMIN',
      isAuthModalOpen: false,
      authMode: 'LOGIN',
      user: savedUser || {
        id: 1,
        maNguoiDung: 'USER_01',
        email: 'trongnhan@stu.edu.vn',
        hoTen: 'Trần Trọng Nhân',
        sdt: '0987654321',
        cccd: '079201008899',
        diaChi: '180 Cao Lỗ, Phường 4, Quận 8, TP.HCM',
        khachMoi: true,
        maNhaCungCap: 'LOCAL',
        vaiTro: 'KHACH_HANG'
      }
    };
  },

  actions: {
    openLogin() {
      this.authMode = 'LOGIN';
      this.isAuthModalOpen = true;
    },

    openRegister() {
      this.authMode = 'REGISTER';
      this.isAuthModalOpen = true;
    },

    closeAuthModal() {
      this.isAuthModalOpen = false;
    },

    persistUser() {
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(this.user));
      } catch (e) {}
    },

    async login(email, password) {
      const data = await AuthService.login(email, password);
      if (data?.user) {
        const isAdminRole = data.user.role === 'ADMIN' || data.user.vaiTro === 'ADMIN';
        this.user = {
          id: data.user.maNguoiDung,
          maNguoiDung: data.user.maNguoiDung,
          email: data.user.email,
          hoTen: data.user.hoTen || data.user.tenNguoiDung,
          sdt: data.user.sdt || '',
          cccd: data.user.cccd || '',
          diaChi: data.user.diaChi || '',
          khachMoi: Boolean(data.user.khachMoi),
          maNhaCungCap: data.user.maNhaCungCap || 'LOCAL',
          vaiTro: isAdminRole ? 'ADMIN' : 'KHACH_HANG'
        };
        this.isLoggedIn = true;
        this.isAdmin = isAdminRole;
        this.persistUser();
        this.isAuthModalOpen = false;
        return this.isAdmin;
      }
      throw new Error('Đăng nhập thất bại');
    },

    async loginAsAdmin() {
      return this.login('admin@trongnhanmobile.vn', 'admin123');
    },

    async register(newUserData) {
      const provider = (newUserData.provider || 'LOCAL').toUpperCase();

      const data =
        provider === 'GOOGLE' || provider === 'FACEBOOK'
          ? await AuthService.oauthLogin({
              email: newUserData.email,
              hoTen: newUserData.hoTen,
              provider
            })
          : await AuthService.register({
              hoTen: newUserData.hoTen,
              email: newUserData.email,
              password: newUserData.password || '123456',
              sdt: newUserData.sdt,
              cccd: newUserData.cccd,
              diaChi: newUserData.diaChi
            });

      if (data?.user) {
        const isAdminRole = data.user.role === 'ADMIN' || data.user.vaiTro === 'ADMIN';
        this.user = {
          id: data.user.maNguoiDung,
          maNguoiDung: data.user.maNguoiDung,
          email: data.user.email,
          hoTen: data.user.hoTen || data.user.tenNguoiDung,
          sdt: data.user.sdt || newUserData.sdt || '',
          cccd: data.user.cccd || newUserData.cccd || '',
          diaChi: data.user.diaChi || newUserData.diaChi || '',
          khachMoi: Boolean(data.user.khachMoi ?? true),
          maNhaCungCap: data.user.maNhaCungCap || provider,
          vaiTro: isAdminRole ? 'ADMIN' : 'KHACH_HANG'
        };
        this.isLoggedIn = true;
        this.isAdmin = isAdminRole;
        this.persistUser();
        this.isAuthModalOpen = false;
        return this.user;
      }
      throw new Error('Không thể tạo tài khoản');
    },

    logout() {
      AuthService.logout();
      localStorage.removeItem(USER_STORAGE_KEY);
      this.isLoggedIn = false;
      this.isAdmin = false;
    }
  }
});
