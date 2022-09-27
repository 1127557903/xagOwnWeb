import {
    createApp
} from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'

// vant使用
import './assets/font/iconfont.css'
import Vant from 'vant';
import 'vant/lib/index.css';

// element使用
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


const app = createApp(App)
app.use(Vant);
app.use(ElementPlus)

app.use(store)
app.use(router)
app.mount('#app')