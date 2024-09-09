import { createStore } from 'vuex';
import loginStore from './modules/loginStore';
import navbarFooterControl from './modules/navbarFooterControl';
import createPersistedState from 'vuex-persistedstate';
export default createStore({
    state: {   
    },
    getters: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        navbarFooterControl,
        loginStore
    },
    plugins: [
        createPersistedState({
            paths: ['loginStore']
        })
    ]
});