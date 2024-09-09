<template>
    <div>
        <span class="header">예약 상세</span>
        <hr>
        <div class="row mb-3">
            <div class="col-md-2 list-header">
                <span>예약 번호</span>
            </div>
            <div class="col-md-4">
                {{ orderId }}
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-2 list-header">
                <span>수업 이름</span>
            </div>
            <div class="col-md-4">
                {{ className }}
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-2 list-header">
                <span>수업 날짜</span>
            </div>
            <div class="col-md-4">
                {{ reservationDate }}
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-2 list-header">
                <span>예약 날짜</span>
            </div>
            <div class="col-md-4">
                {{ reservationDate }}
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-2 list-header">
                <span>결재 금액</span>
            </div>
            <div class="col-md-4">
                {{ paymentAmount }}원
            </div>
        </div>
        <div class="d-flex justify-content-center mt-5">
            <button class="btn btn-outline-dark me-3" @click="cancelOrder">예약 취소</button>
            <button class="btn btn-outline-dark" @click="toReservationList">목록으로</button>
        </div>    
    </div>
</template>

<script>
export default {
    props: {
        activeTab: {
            type: String,
            required: true,
        },
        orderId: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            className: '스테인드글라스 클래스',
            orderDate: '2023-10-01',
            reservationDate: '2023-09-25',
            paymentAmount: '50000'
        }
    },
    methods: {
        cancelReservation() {
            // 주문 취소 로직
            alert('예약을 취소하시겠습니까?');
            alert('예약이 취소되었습니다.');
        },
        toReservationList() {
            this.$emit('change-tab', 'ClassReservation');
        },
    },
    emits: ['change-tab'],
}
</script>

<style scoped>
.header {
    font-size: 1.5rem;
    font-weight: bold;
}
.list-header {
    font-size: 1rem;
    font-weight: bold;
}
.list-link {
    color: #000000;
    text-decoration: none;
}
.list-link:hover {
    text-decoration: underline;
}
</style>