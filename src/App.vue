<template>
<div>
    <navbar-component></navbar-component>
    <router-view></router-view>
    <footer-component></footer-component>
</div>
</template>

<script>
import axios from 'axios';

export default {
    async mounted() {
        await this.getCsrfToken();
        setInterval(async () => {
            if (this.$store.getters.getIsLogin !== false) {
                await this.$store.dispatch('refreshToken');
            }
        }, 60 * 10 * 1000);
    },
    methods: {
        async getCsrfToken() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_URL}common/get-csrf-token/`, {
                    withCredentials: true,
                });
                axios.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
            } catch (error) {
                console.error('Failed to get CSRF token', error);
            }
        }
    }
}

</script>

<style></style>