import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Navbar from '@/components/common/Navbar.vue';
import Footer from '@/components/common/Footer.vue';
import axios from 'axios';
import store from './store/index.js';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

const app = createApp(App);
app.component('navbar-component', Navbar);
app.component('footer-component', Footer);
app.use(router);
app.use(store);
app.mount('#app');