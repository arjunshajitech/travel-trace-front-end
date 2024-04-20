import { createRouter, createWebHistory } from 'vue-router'
import UserRegister from '../views/user/RegisterView.vue'
import AdminLogin from '../views/admin/LoginView.vue'
import AdminHome from '../views/admin/HomeView.vue'
import BusOwnerLogin from '../views/bus_owner/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'user_register',
      component: UserRegister
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
    }
  ]
})

export default router
