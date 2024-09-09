const navbarFooterControl = {
    state: {
        showNavbar: true,
        showFooter: true,
    },
    getters: {
        getShowNavbar: state => state.showNavbar,
        getShowFooter: state => state.showFooter
    },
    mutations: {
        setShowNavbar(state, show) {
            state.showNavbar = show;
        },
        setShowFooter(state, show) {
            state.showFooter = show;
        },
    },
    actions: {
        updateShowNavbar({ commit }, show) {
            commit('setShowNavbar', show);
        },
        updateShowFooter({ commit }, show) {
            commit('setShowFooter', show);
        },
    },
};

export default navbarFooterControl;