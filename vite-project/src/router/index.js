import {
    createRouter,
    createWebHistory
} from "vue-router";
import PCRouter from "./pc";
import PhoneRouter from "./phone";
import {
    TOKEN,
    EQUIPMENT,
    UPDATE_EQUIPMENT
} from '../store/constants';
import {
    Dialog
} from "vant";
import store from '../store'
let router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            meta: {
                required: false
            },
            name: 'index',
            component: () => import('@/view/index.vue')
        },
        ...PCRouter,
        ...PhoneRouter
    ]
})

// 路由拦截器
router.beforeEach((to, from, next) => {
    let token = store.getters[TOKEN]
    let {
        required
    } = to.meta
    let {fullPath} = to
    let equipment = store.getters[EQUIPMENT]
    // 判断设备
    if(!equipment){
        equipment = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent) ? '手机' : '电脑';
        store.commit(UPDATE_EQUIPMENT,equipment)
    }
    if (required && !token) {
        Dialog.alert({
            message: '请先登录！',
        }).then(() => {
            next({name:equipment == '电脑' ? 'pcLogin' : 'phLogin',params:{fullPath}})
        });
        return
    }
    next()
})

export default router;