<template>
    <div>
        <div class="mb-5">
            <span class="list-header">나의 정보</span>
            <hr>
            <div class="row mb-3">
                <div class="col-md-2">
                    <span>이름</span>
                </div>
                <div class="col-md-4">
                    {{ user.name }}
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-2">
                    <span>이메일</span>
                </div>
                <div class="col-md-4">
                    {{ user.email }}
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-2">
                    <span>전화번호</span>
                </div>
                <div class="col-md-4">
                    {{ formatMobile(user.mobile) }}
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-2">
                    <span>주소</span>
                </div>
                <div class="col-md-6">
                    {{ user.address }}, {{ user.address_extra }} {{ user.address_detail }}
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="d-flex justify-content-between">
                    <span class="list-header">주문 내역</span>
                    <a href="#" class="more-button" @click="moreButton('OrderHistory')">>> 더보기</a>
                </div>
                <hr>
                <ul>
                    <li v-for="order in orders" :key="order.id">
                        {{ order.description }} - {{ order.date }}
                    </li>
                </ul>
            </div>
            <div class="col-md-6">
                <div class="d-flex justify-content-between">
                    <span class="list-header">클래스 예약 내역</span>
                    <a href="#" class="more-button" @click="moreButton('ClassReservation')">>> 더보기</a>    
                </div>
                <hr>
                <ul>
                    <li v-for="reservation in reservations" :key="reservation.id">
                        {{ reservation.class }} - {{ reservation.date }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {},
            orders: [
                { id: 1, description: '주문 1', date: '2023-01-01' },
                { id: 2, description: '주문 2', date: '2023-01-02' },
            ],
            reservations: [
                { id: 1, class: '클래스 1', date: '2023-01-03' },
                { id: 2, class: '클래스 2', date: '2023-01-04' },
            ],
        };
    },
    mounted() {
        this.setUserData();
    },
    methods: {
        setUserData() {
            this.user = this.$store.getters.getUserInfo;
        },
        formatMobile(mobile) {
            if (/^\d{11}$/.test(mobile)) {
                return mobile.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            }
            return mobile;
        },
        moreButton(tab) {
            this.$emit('change-tab', tab);
        }
    },
    emits: ['change-tab'],
};
</script>

<style scoped>
.list-header {
    font-size: 1.5rem;
    font-weight: bold;
}

.more-button {
    font-size: 0.8rem;
    color: #888888;
    text-decoration: none;
}

.more-button:hover {
    color: #000000;
    text-decoration: underline;
}
</style>