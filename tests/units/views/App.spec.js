import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { createRouter, createWebHistory } from 'vue-router';
import { createApp } from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import App from '@/App.vue';
import NavbarComponent from '@/components/common/Navbar.vue';
import FooterComponent from '@/components/common/Footer.vue';
import HomeComponent from '@/views/Home.vue';


// JSDOM을 사용하여 브라우저 환경을 시뮬레이션
const dom = new JSDOM('', { url: 'http://localhost/' });
global.window = dom.window;
global.document = dom.window.document;
global.navigator = {
    userAgent: 'node.js',
};

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'Home', component: HomeComponent },
    ],
});

describe('App.vue', () => {
    let store;
    let getters;
    let actions;

    beforeEach(() => {
        // Vuex 스토어 설정
        getters = {
            getIsLogin: () => true,
        };

        actions = {
            refreshToken: vi.fn(),
        };

        store = new Vuex.Store({
            getters,
            actions,
        });

        // 모듈 모킹
        vi.mock('axios');
        vi.useFakeTimers();

        // Vue 인스턴스 생성 및 라우터 추가
        const app = createApp(App);
        app.use(router);
        app.use(store);
        app.component('navbar-component', NavbarComponent);
        app.component('footer-component', FooterComponent);
        app.mount(document.createElement('div'));

    });

    it('calls getCsrfToken on mount', async () => {
        // axios.get 모킹
        axios.get.mockResolvedValue({ data: { csrfToken: 'test-token' } });

        mount(App, {
            global: {
                plugins: [store],
                components: {
                    'navbar-component': NavbarComponent, 
                    'footer-component': FooterComponent,
                }
            },
        });

        vi.advanceTimersByTime(1000);

        // axios.get이 호출되었는지 확인
        expect(axios.get).toHaveBeenCalledWith(`${process.env.VUE_APP_API_URL}common/get-csrf-token/`, {
            withCredentials: true,
        });
        // axios.defaults.headers.common['X-CSRFToken']가 설정되었는지 확인
        axios.defaults.headers.common['X-CSRFToken'] = 'test-token';
        expect(axios.defaults.headers.common['X-CSRFToken']).toBe('test-token');
    });

    it('sets an interval to refresh token', async () => {
        mount(App, {
            global: {
                plugins: [store],
                components: {
                    'navbar-component': NavbarComponent, 
                    'footer-component': FooterComponent,
                }
            },
        });

        // 10분이 지난 후 refreshToken 액션을 호출하는지 확인
        vi.advanceTimersByTime(60 * 10 * 1000);
        expect(actions.refreshToken).toHaveBeenCalled();
    });
});