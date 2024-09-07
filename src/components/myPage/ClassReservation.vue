<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <h2>예약 내역</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-2"><strong>예약 번호</strong></div>
            <div class="col-2"><strong>수업 이름</strong></div>
            <div class="col-2"><strong>수업 날짜</strong></div>
            <div class="col-2"><strong>결제 금액</strong></div>
            <div class="col-2"><strong>예약 날짜</strong></div>
        </div>
        <div class="row text-center" v-for="reservation in reservations" :key="reservation.id">
            <div class="col-2">{{ reservation.reservationNumber }}</div>
            <div class="col-2">{{ reservation.className }}</div>
            <div class="col-2">{{ reservation.classDate }}</div>
            <div class="col-2">{{ reservation.paymentAmount }}</div>
            <div class="col-2">{{ reservation.reservationDate }}</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            reservations: [
                { id: 1, reservationNumber: 'R20230001', className: '요가 클래스', classDate: '2023-02-01', paymentAmount: 15000, reservationDate: '2023-01-15' },
                { id: 2, reservationNumber: 'R20230002', className: '필라테스 클래스', classDate: '2023-02-05', paymentAmount: 20000, reservationDate: '2023-01-20' },
            ],    
        }
    },
};
</script>

<style scoped>
.container {
    margin-top: 20px;
}
.row {
    margin-bottom: 10px;
}
.row strong {
    display: block;
    text-align: center;
}
</style>