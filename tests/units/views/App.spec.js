import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { createRouter, createWebHistory } from 'vue-router';
import Vuex from 'vuex';
import axios from 'axios';
import App from '@/App.vue';
import NavbarComponent from '@/components/common/Navbar.vue';
import FooterComponent from '@/components/common/Footer.vue';


// JSDOM을 사용하여 브라우저 환경을 시뮬레이션
const dom = new JSDOM();
global.window = dom.window;
global.document = dom.window.document;
global.navigator = {
    userAgent: 'node.js',
};

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'Home' },
    ],
});

describe('App.vue', () => {
    let store;
    let getters;
    let actions;

    beforeEach(() => {
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

    });

    it('calls getCsrfToken on mount', async () => {

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

        vi.runAllTimers();

        expect(axios.get).toHaveBeenCalledWith(`${process.env.VUE_APP_API_URL}common/get-csrf-token/`, {
            withCredentials: true,
        });
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

        vi.runAllTimers();

        expect(actions.refreshToken).toHaveBeenCalled();
    });
});