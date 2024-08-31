import router from '@/router'
import axios from 'axios'

const loginStore = {
    state: {
        userInfo: null,
        isLogin: false,
    },
    getters: {
        getUserInfo(state) {
            return state.userInfo
        },
        getIsLogin(state) {
            return state.isLogin
        }
    },
    mutations: {
        loginSuccess(state, status) {
            state.isLogin = status
        },
        setUserData(state, userData) {
            state.userInfo = userData
        },
        logoutSuccess(state) {
            state.userInfo = null
            state.isLogin = false
            localStorage.removeItem('naverToken')
            localStorage.removeItem('naverCode')
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
        },
    },
    actions: {
        async login({ commit, dispatch }, payload) {
            const config = {
                withCredentials: true,
            }
            await axios
                .post(`${process.env.VUE_APP_API_URL}accounts/auth/login/`, {
                    email: payload.email,
                    password: payload.password,
                }, config)
                .then(async (response) => {
                    if (response.status === 200) {
                        localStorage.setItem('accessToken', response.data.access)
                        localStorage.setItem('refreshToken', response.data.refresh)
                        commit('setUserData', response.data.user)
                        commit('loginSuccess', true)
                    } else if (response.status === 204) {
                        alert('비밀번호가 일치하지 않습니다.')
                    }
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        alert('존재하지 않는 계정입니다.')
                    } else {
                        alert('오류가 발생했습니다. 사이트 관리자에게 문의해주세요.', error)
                    }
                })
        },
        async register({ commit }, payload) {
            await axios
                .post(`${process.env.VUE_APP_API_URL}/accounts/auth/register/`, payload, {
                    withCredentials: true
                })
                .then((response) => {
                    if (response.status === 201) {
                        localStorage.setItem('accessToken', response.data.access);
                        localStorage.setItem('refreshToken', response.data.refresh);
                        commit('loginSuccess', true);
                        commit('setUserData', response.data.user);
                        alert('회원가입이 완료되었습니다.');
                    } else {
                        alert('회원가입에 실패했습니다.');
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        async getUserData({ commit }) {
            const accessToken = localStorage.getItem('accessToken')

            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                withCredentials: true,
            }

            await axios
                .get(`${process.env.VUE_APP_API_URL}accounts/auth/user/`, config)
                .then((response) => {
                    const userData = {
                        email: response.data.email,
                        name: response.data.name,
                        phone: response.data.phone_number,
                    }
                    commit('setUserData', userData)
                })
                .catch((error) => {
                    alert('Fail to get user data.', error)
                })
        },
        async logout({ commit, state }) {
            const naverToken = localStorage.getItem('naverToken', null)
            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                withCredentials: true,
            }

            if (state.isLogin === true) {
                await axios
                    .post(`${process.env.VUE_APP_API_URL}accounts/auth/logout/`, {
                    }, config)
                    .then((response) => {
                        if (response.status === 200) {
                            commit('logoutSuccess')
                        } else {
                            alert('Fail to logout.')
                        }
                    })
                    .catch((error) => {
                        alert('Fail to logout.', error)
                    })
            } else {
                await axios
                    .post(`${process.env.VUE_APP_API_URL}accounts/naver/logout/`, {
                        'naver_token': naverToken,
                    }, config)
                    .then((response) => {
                        if (response.status === 200) {
                            commit('logoutSuccess')
                        } else {
                            alert('Fail to logout.')
                        }
                    })
                    .catch((error) => {
                        alert('Fail to logout.', error)
                    })    
            }
        },
        async socialLoginToDjango({ commit, dispatch }) {
            const token = localStorage.getItem('naverToken')
            const code = localStorage.getItem('naverCode')
            const config = {
                access_token: token,
                code: code,
            }

            await axios
                .post(`${process.env.VUE_APP_API_URL}accounts/login-to-django/login/`, config, {
                    withCredentials: true,
                } )
                .then(async (response) => {
                    if (response.status === 200) {
                        console.log(response.data)
                        localStorage.setItem('accessToken', response.data.access)
                        localStorage.setItem('refreshToken', response.data.refresh)
                        localStorage.removeItem('naverCode')
                        await dispatch('getNaverUserData')
                        commit('loginSuccess', 'naver')
                    } else {
                        alert('Fail to login to Django.')
                    }
                })
                .catch((error) => {
                    alert('Fail to login to Django.', error)
                })
        },
        async getNaverUserData({ commit, state }) {
            const naverToken = localStorage.getItem('naverToken', null)
            const accessToken = localStorage.getItem('accessToken')

            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: {
                    'naver_token': naverToken,        
                },
                withCredentials: true,
            }

            await axios
                .get(`${process.env.VUE_APP_API_URL}accounts/naver-userdata/get/`, config)
                .then((response) => {
                    const userData = {
                        email: response.data.email,
                        name: response.data.name,
                        phone: response.data.phone_number,
                        nickname: response.data.nickname,
                    }
                    commit('setUserData', userData)
                    console.log(state.userInfo)
                })
                .catch((error) => {
                    alert('Fail to get user data.', error)
                })
        },
        async refreshToken() {
            const refreshToken = localStorage.getItem('refreshToken')

            axios
                .post(`${process.env.VUE_APP_API_URL}accounts/token/refresh/`, {
                    refresh: refreshToken,
                }, {
                    withCredentials: true,
                })
                .then((response) => {
                    if (response.status === 200) {
                        localStorage.setItem('accessToken', response.data.access)
                    } else {
                        alert('Fail to refresh token.')
                    }
                })
                .catch((error) => {
                    alert('Fail to refresh token.', error)
                })
        }
    }
}

export default loginStore