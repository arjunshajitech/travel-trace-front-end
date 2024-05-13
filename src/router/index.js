import { createRouter, createWebHistory } from 'vue-router'
import UserRegister from '../views/user/RegisterView.vue'
import UserHome from '../views/user/HomeView.vue'
import AdminLogin from '../views/admin/LoginView.vue'
import AdminHome from '../views/admin/HomeView.vue'
import BusOwnerLogin from '../views/bus_owner/LoginView.vue'
import BusOwnerHome from '../views/bus_owner/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'user_register',
      component: UserRegister
    },
    {
      path: '/home',
      name: 'user_home',
      component: UserHome
    },
    {
      path: '/admin',
      name: 'admin_login',
      component: AdminLogin
    },
    {
      path: '/busowner',
      name: 'busowner_login',
      component: BusOwnerLogin
    },
    {
      path: '/admin/home',
      name: 'admin_home',
      component: AdminHome
    },
    {
      path: '/busowner/home',
      name: 'busowner_home',
      component: BusOwnerHome
    }
  ]
})

export default router
