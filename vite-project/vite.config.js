import {
  defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import {
  resolve
} from 'path'
import styleImport, {
  VantResolve
} from 'vite-plugin-style-import';
import config from './src/config/config';
// https: //vitejs. dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    https: true, //是否启用https
    cors: true, //是否允许跨域
    open: true, //启动后自动打开页面
    port: '8080', //占有端口
    strictPort: false, //端口占有时是否弹出
    force: false, //是否强制依赖预构建
    hmr: true, //是否开启热更新
    proxy: {
      '/api': {
        target: config.HTTP,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  devServer: {
    host: 'localhost'
  },
  plugins: [vue(), styleImport({
    resolves: [VantResolve()],
  }), ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    //css预处理
    preprocessorOptions: {
      scss: {
        /*
        引入var.scss全局预定义变量，
        如果引入多个文件，
        可以使用
        '@import "@/assets/scss/globalVariable1.scss";@import "@/assets/scss/globalVariable2.scss";'
        这种格式
         */
        additionalData: '@import "@/assets/scss/index.scss";'
      }
    }
  }
})