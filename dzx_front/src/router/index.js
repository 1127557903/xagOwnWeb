import { Tab } from 'vant'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Tabs from '../views/Tabs.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Tabs',
    component: Tabs,
    children:[
      {
        path: '/',
        name: 'Home',
        component: Home
      },
      {
        path: '/road',
        name: 'Road',
        component: function () {
          return import( '../views/Road.vue')
        }
      },
      {
        path: '/my',
        name: 'my',
        component: function () {
          return import( '../views/My.vue')
        }
      },
      {
        path: '/destination',
        name: 'destination',
        component: function () {
          return import( '../views/Destination/Destination.vue')
        }
      },
    ]
  },
  {
    path: '/introduction',
    name: 'introduction',
    component: function () {
      return import('../components/Introduction/Introduction.vue')
    }
  },
  {
    path: '/introductionDetail',
    name: 'introductionDetail',
    component: function () {
      return import('../components/IntroductionDetail/IntroductionDetail.vue')
    }
  },
  {
    path: '/travels',
    name: 'travels',
    component: function () {
      return import('../components/Travels/Travels.vue')
    }
  },
  {
    path: '/chat',
    name: 'chat',
    component: function () {
      return import('../components/Chat/Chat.vue')
    }
  },
  {
    path: '/spotDetail',
    name: 'spotDetail',
    component: function () {
      return import('../components/SpotDetail/SpotDetail.vue')
    }
  },
    {
    path: '/login',
    name: 'login',
    component: function () {
      return import('../components/Login/Login.vue')
    }
  },
  {
    path: '/register',
    name: 'register',
    component: function () {
      return import('../components/Register/Register.vue')
    }
  },
  {
    path: '/trip',
    name: 'trip',
    component: function () {
      return import('../components/Trip/Trip.vue')
    }
  },
  {
    path: '/addtrip',
    name: 'addtrip',
    component: function () {
      return import('../components/Addtrip/Addtrip.vue')
    }
  },
  {
    path: '/mytrip',
    name: 'mytrip',
    component: function () {
      return import('../components/Mytrip/Mytrip.vue')
    }
  },
  {
    path: '/addtravels',
    name: 'addtravels',
    component: function () {
      return import('../components/Addtravels/Addtravels.vue')
    }
  },
  {
    path: '/mytravels',
    name: 'mytravels',
    component: function () {
      return import('../components/Mytravels/Mytravels.vue')
    }
  },
  {
    path: '/alltrip',
    name: 'alltrip',
    component: function () {
      return import('../components/Alltrip/Alltrip.vue')
    }
  },
  {
    path: '/allstop',
    name: 'allstop',
    component: function () {
      return import('../components/Allstop/Allstop.vue')
    }
  },
  {
    path: '/moredelicous',
    name: 'moredelicous',
    component: function () {
      return import('../components/MoreDelicous/MoreDelicous.vue')
    }
  },
  {
    path: '/delicous',
    name: 'delicous',
    component: function () {
      return import('../components/delicous/delicous.vue')
    }
  },
  {
    path: '/information',
    name: 'information',
    component: function () {
      return import('../components/Information/Information.vue')
    }
  },
  {
    path: '/hotel',
    name: 'hotel',
    component: function () {
      return import('../components/Hotel/Hotel.vue')
    }
  },
  {
    path: '/hotelDetail',
    name: 'hotelDetail',
    component: function () {
      return import('../components/HotelDetail/HotelDetail.vue')
    }
  },
  {
    path: '/showImg',
    name: 'showImg',
    component: function () {
      return import('../components/showImg/showImg.vue')
    }
  },
  {
    path: '/notice',
    name: 'notice',
    component: function () {
      return import('../components/notice/notice.vue')
    }
  },
  {
    path: '/allnotice',
    name: 'allnotice',
    component: function () {
      return import('../components/Allnotice/Allnotice.vue')
    }
  },
]

const router = new VueRouter({
  routes
})

export default router
