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
    },{
        path: 'learnRef',
        name: 'learnRef',
        meta: {
            required: false
        },
        component: () => import('@/view/pc/studant/learnRef.vue')
    },{
        path: 'learnReactive',
        name: 'learnReactive',
        meta: {
            required: false
        },
        component: () => import('@/view/pc/studant/learnReactive.vue')  
    },{
        path: 'learnComputed',
        name: 'learnComputed',
        meta: {
            required: false
        },
        component: () => import('@/view/pc/studant/learnComputed.vue')  
    },{
        path: 'learnWatch',
        name: 'learnWatch',
        meta: {
            required: false
        },
        component: () => import('@/view/pc/studant/learnWatch.vue')  
    },{
        path: 'three',
        name: 'three',
        meta: {
            required: false
        },
        component: () => import('@/view/pc/studant/three.vue')  
    }
    ]
}]

export default PCRouter