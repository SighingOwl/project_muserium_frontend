// App.spec.js
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import App from '@/App.vue';
import axios from 'axios';
import Vuex from 'vuex';

vi.mock('axios');

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
    });

    it('calls getCsrfToken on mount', async () => {
        axios.get.mockResolvedValue({ data: { csrfToken: 'test-token' } });

        mount(App, {
            global: {
                plugins: [store],
            },
        });

        await vi.runAllTimers();

        expect(axios.get).toHaveBeenCalledWith(`${process.env.VUE_APP_API_URL}common/get-csrf-token/`, {
            withCredentials: true,
        });
        expect(axios.defaults.headers.common['X-CSRFToken']).toBe('test-token');
    });

    it('sets an interval to refresh token', async () => {
        mount(App, {
            global: {
                plugins: [store],
            },
        });

        await vi.runAllTimers();

        expect(actions.refreshToken).toHaveBeenCalled();
    });
});