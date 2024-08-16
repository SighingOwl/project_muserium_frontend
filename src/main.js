import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

const app = createApp(App);
app.component('navbar-component', Navbar);
app.component('footer-component', Footer);
app.use(router);
app.mount('#app');