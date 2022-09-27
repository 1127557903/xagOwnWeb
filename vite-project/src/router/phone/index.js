const PhoneRouter = [{
    path: '/phone',
    name: 'phone',
    children: [{
            path: 'chart',
            name: 'chart',
            meta: {
                required: true
            },
            component: () => import('@/view/phone/chart/chart.vue')
        }, {
            path: 'phLogin',
            name: 'phLogin',
            component: () => import('@/view/phone/login/login.vue')
        },
        {
            path: 'phRegister',
            name: 'phRegister',
            component: () => import('@/view/phone/register/register.vue')
        },
        {
            path: 'scan',
            name: 'scan',
            component: () => import('@/view/phone/scan/scan.vue')
        },
        {
            path: 'manga',
            name: 'manga',
            component: () => import('@/view/phone/manga/manga.vue')
        }
    ],
    component: () => import('@/view/phone/phone.vue')
}]

export default PhoneRouter