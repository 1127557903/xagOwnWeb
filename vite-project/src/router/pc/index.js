const PCRouter = [{
    path: '/pc',
    name: 'pc',
    meta: {
        required: true
    },
    component: () => import('@/view/pc/pc.vue'),
    children:[{
        path: 'pcLogin',
        name: 'pcLogin',
        meta: {
            required: false
        },
        component: () => import('@/view/pc/pcLogin/pcLogin.vue')
    }]
}]

export default PCRouter