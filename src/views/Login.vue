<template>
    <div class="container text-center">
        <img :src="brandLogoURL" class="logo-img mt-5">
    </div>
    
    <div class="container my-5 d-flex justify-content-center">
        <div class="col-md-5">
            <h2 class="mb-4">로그인</h2>
            <form @submit.prevent="handleLogin">
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="email" placeholder="이메일을 입력해주세요." v-model="email" required />
                    <label for="username">이메일</label>
                </div>
                <div class="form-floating mb-4">
                    <input type="password" class="form-control" id="password" placeholder="비밀번호를 입력해주세요." v-model="password" required />
                    <label for="password">비밀번호</label>
                </div>
                <div class="d-flex justify-content-center">
                    <button type="submit" class="btn btn-outline-dark col-md-7 mb-3" @click="handleLogin('server')">로그인</button>
                </div>
                <div class="d-flex justify-content-end">
                    <a href="/restore-accounts/" class="id-password-recover">이메일 / 비밀번호 찾기</a>
                </div>
            </form>
            <hr>
            <div class="d-flex flex-column justify-content-center align-items-center">
                <a href="/signup/" type="button" class="btn btn-outline-dark col-md-7 mb-3">회원가입</a>
                <a href="#" class="d-flex justify-content-center align-items-center" @mouseover="onBtn = true" @mouseleave="onBtn = false" @click="handleLogin('naver')">
                    <img v-if="onBtn" src="../assets/img/btnW_Naver.png" alt="네이버 아이디로 로그인" class="login-img" >
                    <img v-else src="../assets/img/btnG_Naver.png" alt="네이버 아이디로 로그인" class="login-img">    
                </a>    
            </div>    
        </div>
    </div>
</template>
    
<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            email: '',
            password: '',
            brandLogoURL: process.env.VUE_APP_BRAND_FOOTER_LOGO_URL,
            onBtn: false,
        };
    },
    computed: {
        ...mapGetters(['getIsLogin']),
        isLogin() {
            return this.getIsLogin;
        }
    },
    watch: {
        isLogin(newVal) {
            if (newVal) {
                this.$router.go(-1);
            }
        },
    },
    methods: {
        handleLogin(platform) {
            if (platform === 'server') {
                this.$store.dispatch('login', {
                    email: this.email,
                    password: this.password,
                });
            } else if (platform === 'naver') {
                window.open(`${process.env.VUE_APP_API_URL}accounts/naver/login/`, "naverlogin", "width=700, height=500");
            }
        },
    },
}

</script>
    
<style scoped>
.logo-img {
    max-width: 25%;
}

.container input {
    padding: 0.5em;
}

.container button {
    padding: 0.5em;
    border-radius: 5px;
    cursor: pointer;
}

.id-password-recover {
    font-size: 0.8em;
    color: #888888;
    text-decoration: none;
}

.id-password-recover:hover {
    color: #000000;
    text-decoration: underline;
}

.login-img {
    max-width: 30%;
}

</style>