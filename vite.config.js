import { fileURLToPath, URL } from 'node:url';
import net from 'node:net';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Plugin tự động khởi chạy Backend Express + MySQL WampServer (cổng 8080) ngay khi chạy "npm run dev"
function autoStartMysqlBackendPlugin() {
  let started = false;
  return {
    name: 'auto-start-mysql-backend',
    configureServer() {
      if (started) return;
      started = true;

      // Kiểm tra xem cổng 8080 đã mở chưa, nếu chưa thì tự động nạp server/index.js
      const probe = net.createConnection({ host: '127.0.0.1', port: 8080 });
      probe.on('connect', () => {
        probe.end();
        console.log('ℹ️ Phát hiện Backend MySQL đã chạy sẵn trên cổng 8080.');
      });
      probe.on('error', () => {
        import('./server/index.js').catch(err => {
          console.error('❌ Không thể tự khởi chạy server/index.js:', err.message);
        });
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    autoStartMysqlBackendPlugin()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
