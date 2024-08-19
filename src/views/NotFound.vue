<template>
    <div class="container text-center">
        <img :src="brandLogoURL" class="error-img mt-5">
        <h1 class="display-1 mt-5">404</h1>
        <p class="lead">페이지를 찾을 수 없습니다.</p>
        <p class="lead">사이트 관리자에게 문의해주세요.</p>
        <button @click="goBack" class="btn btn-dark mb-5">이전 페이지로</button>
    </div>
</template>

<script>
export default {
    name: 'NotFound',
    data() {
        return {
            brandLogoURL: process.env.VUE_APP_BRAND_FOOTER_LOGO_URL,
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        }
    }
};
</script>

<style scoped>
.container {
    margin-top: 50px;
}
.error-img {
    max-width: 25%;
}
</style>