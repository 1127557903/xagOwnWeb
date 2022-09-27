const PCRouter = [{
    path: '/pc',
    name: 'pc',
    component: () => import('@/view/pc/pc.vue'),
    children:[{
        path: 'pcLogin',
        name: 'pcLogin',
        component: () => import('@/view/pc/pcLogin/pcLogin.vue')
    }]
}]

export default PCRouter