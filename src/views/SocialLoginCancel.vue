<template>
    <div class="container text-center brand-logo">
        <img :src="brandLogoURL" alt="Musetium Logo" id="mg-nav-logo">
    </div>
    <div class="cancel-page">
        <p>소셜 로그인이 취소되었습니다. 다시 시도해 주세요.</p>
        <button class="btn btn-outline-dark" @click="closeWindow">닫기</button>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    data() {
        return {
            brandLogoURL: process.env.VUE_APP_BRAND_FOOTER_LOGO_URL,
        }
    },
    mounted() {
        this.setShowNavbar(false);
        this.setShowFooter(false);
    },
    beforeDestroy() {
        this.setShowNavbar(true);
        this.setShowFooter(true);
    },
    methods: {
        ...mapMutations(['setShowNavbar', 'setShowFooter']),
        closeWindow() {
            window.close();
        }
    }
}
</script>

<style scoped>
.brand-logo img {
  max-width: 25%;

}

.cancel-page {
  text-align: center;
  margin-top: 50px;
}

.cancel-page p {
  margin: 20px 0;
}

.cancel-page a {
  color: #007bff;
  text-decoration: none;
}
</style>