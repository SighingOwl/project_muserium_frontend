import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import RestoreAccounts from '../views/RestoreAccounts.vue';
import SocialLoginCancel from '@/views/SocialLoginCancel.vue';
import ProceedLogin from '@/views/ProceedLogin.vue';
import Signup from '@/views/Signup.vue';
import MyPage from '@/views/MyPage.vue';
import Class from '@/views/Class.vue';
import ClassDetail from '@/views/ClassDetail.vue';
import Shop from '@/views/Shop.vue';
import ProductDetail from '../views/ProductDetail.vue';
import CustomerSupport from '@/views/CustomerSupport.vue';
import NotFound from '@/views/errorViews/NotFound.vue';
import Unauthorized from '../views/errorViews/Unauthorized.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/restore-accounts/',
    name: 'RestoreAccounts',
    component: RestoreAccounts,
  },
  {
    path: '/social-login-cancel/',
    name: 'SocialLoginCancel',
    component: SocialLoginCancel,
  },
  {
    path: '/proceed-login/:pathMatch(.*)*',
    name: 'ProceedLogin',
    component: ProceedLogin,
  },
  {
    path: '/signup/',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/my-page/',
    name: 'MyPage',
    component: MyPage,
  },
  {
    path: '/class/',
    name: 'Class',
    component: Class,
  },
  {
    path: '/class/:classID/',
    name: 'ClassDetail',
    component: ClassDetail,
    props: true
  },
  {
    path: '/shop/',
    name: 'Shop',
    component: Shop,
  },
  {
    path: '/shop/:productID/',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true
  },
  {
    path: '/support/',
    name: 'CustomerSupport',
    component: CustomerSupport,
  },
  {
    path: '/:pathMatch(.*)*', 
    name: 'NotFound',
    component: NotFound
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Unauthorized',
    component: Unauthorized
  }

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});




export default router;