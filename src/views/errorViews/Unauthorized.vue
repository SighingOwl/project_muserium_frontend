<template>
    <div v-if="showWarning" class="container text-center">
        <img :src="brandLogoURL" class="logo-img mt-5">
        <h1 class="display-1 mt-5">401</h1>
        <p class="lead">권한이 없습니다.</p>
        <p class="lead">사이트 관리자에게 문의해주세요.</p>
        <button @click="goBack" class="btn btn-dark mb-5">메인 페이지로</button>
    </div>
</template>

<script>
export default {
    name: 'NotFound',
    data() {
        return {
            brandLogoURL: process.env.VUE_APP_BRAND_FOOTER_LOGO_URL,
            showWarning: false,
        }
    },
    mounted() {
        if (this.$store.getters.getIsLogin !== false) {
            this.$store.dispatch('refreshToken');
            this.$router.go(-1);
        } else {
            this.showWarning = true;
        }
    },
    methods: {
        goMain() {
            this.$router.push('/');
        }
    }
};
</script>

<style scoped>
.logo-img {
    max-width: 25%;
}
</style>