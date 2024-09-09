<template>
    <div class="container mt-5">
        <div class="card">
            <h2>휴대폰 본인인증</h2>
        </div>
        
    </div>
</template>

<script>
export default {
    data() {
        return {
            phoneNumber: ''
        };
    },
    methods: {
        verifyPhone() {
            // 여기에 본인인증 로직을 추가하세요.
            alert(`인증 요청: ${this.phoneNumber}`);
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 500px;
}
</style>