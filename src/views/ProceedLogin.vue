<template>
    <div class="container text-center brand-logo">
        <img :src="brandLogoURL" alt="Musetium Logo" id="mg-nav-logo">
    </div>
    <div v-if="isLoading" class="d-flex justify-content-center align-items-center vh-100">
        <div class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">로그인 진행 중...</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            brandLogoURL: process.env.VUE_APP_BRAND_FOOTER_LOGO_URL,
            isLoading: false
        };
    },
    computed: {
        isLogin() {
            return this.$store.getters.getIsLogin;
        },
    },
    mounted() {
        this.$store.dispatch('updateShowNavbar', false);
        this.$store.dispatch('updateShowFooter', false);
        this.isLoading = true;
        this.getAccessTokenFromURL();
    },
    beforeDestroy() {
        this.$store.dispatch('updateShowNavbar', true);
        this.$store.dispatch('updateShowFooter', true);
        this.isLoading = false;
    },
    methods: {
        async getAccessTokenFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('access_token');
            const code = urlParams.get('code');
            if (token && code) {
                localStorage.setItem('naverToken', token);
                localStorage.setItem('naverCode', code);
            } else {
                console.error('Failed to get access token or code');
            }
            await this.$store.dispatch('socialLoginToDjango');

            if (this.isLogin){
                window.close();        
            }
        },
    }
}
</script>

<style scoped>
.brand-logo img {
  max-width: 25%;

}
</style>