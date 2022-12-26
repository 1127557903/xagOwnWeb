const PhoneRouter = [{
    path: '/phone',
    name: 'phone',
    redirect: '/phone/tabs',
    children: [
        {
            path: 'tabs',
            name: 'tabs',
            redirect: '/phone/tabs/home',
            meta: {
                required: false
            },
            component: () => import('@/view/phone/tabs/tabs.vue'),
            children:[{                
                path: 'home',
                name: 'home',
                meta: {
                    required: false
                },
                component: () => import('@/view/phone/tabs/home/home.vue')
            },{                
                path: 'my',
                name: 'my',
                meta: {
                    required: false
                },
                component: () => import('@/view/phone/tabs/my/my.vue')
            }]
        },
        {
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
        },
        {
            path: 'postings',
            name: 'postings',
            component: () => import('@/view/phone/postings/postings.vue')
        },
    ],
    component: () => import('@/view/phone/phone.vue')
}]

export default PhoneRouter