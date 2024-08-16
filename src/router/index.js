import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
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
    path: '/class/',
    name: 'Class',
    component: Class,
  },
  {
    path: '/class/:title',
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