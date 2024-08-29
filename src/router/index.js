import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import SocialLoginCancel from '@/views/SocialLoginCancel.vue';
import ProceedLogin from '@/views/ProceedLogin.vue';
import Class from '@/views/Class.vue';
import ClassDetail from '@/views/ClassDetail.vue';
import NotFound from '@/views/NotFound.vue';

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
    path: '/class/',
    name: 'Class',
    component: Class,
  },
  {
    path: '/class/:classID',
    name: 'ClassDetail',
    component: ClassDetail,
    props: true
  },
  {
    path: '/:pathMatch(.*)*', 
    name: 'NotFound',
    component: NotFound
  }

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;