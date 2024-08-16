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
    },
    methods: {
        async getCsrfToken() {
            try {
                const response = await axios.get('https://localhost:8000/common/get-csrf-token/', {
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