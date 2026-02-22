import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import VerifyRegisterView from '../views/VerifyRegisterView.vue'
import ResendEmailView from '../views/ResendEmailView.vue'
import ForgotPwdView from '../views/ForgotPwdView.vue'
import ResetPwdView from '../views/ResetPwdView.vue'
import MemberView from '../views/MemberView.vue'
import Mainlayout from '../components/Mainlayout.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/verify-register',
      name: 'verify-register',
      component: VerifyRegisterView,
    },
    {
      path: '/resend-email',
      name: 'resend-email',
      component: ResendEmailView,
    },
    {
      path: '/forgot-pwd',
      name: 'forgot-pwd',
      component: ForgotPwdView,
    },
    {
      path: '/reset-pwd',
      name: 'reset-pwd',
      component: ResetPwdView,
    },
    {
      path: '/',
      name: 'mainlayout',
      component: Mainlayout,
      meta: { requiresAuth: true },
      children: [ // 子路由
        {
          path: '/',
          name: 'home',
          component: HomeView,
          meta: { requiresAuth: true }
        },
        {
          path: '/member',
          name: 'member',
          component: MemberView,
          meta: { requiresAuth: true }
        },
      ]
    },
  ],
})

// 換頁前、重整前執行(檢查是否登入，若無登入則跳轉回登入頁)
router.beforeEach(
  async (to, from) => {
    const userStore = useUserStore();
    const token = localStorage.getItem("jwt_token");
    const provider = userStore.provider;

    // 如果要進到需登入的畫面(to.meta.requiresAuth)，但沒有token，則導向登入頁
    if (to.meta.requiresAuth && !token) {
      return '/login';  // 直接回傳路徑字串
    }

    // 如果有token，但store顯示未登入，則再確認登入狀態(重新store)，若為驗證成功，則導向登入頁
    if (token && !userStore.isLogin) {
      const isValid = await userStore.checkLogin(provider);

      if (!isValid) {
        return '/login';  // 直接回傳路徑字串
      }
    }
  }
);

export default router
