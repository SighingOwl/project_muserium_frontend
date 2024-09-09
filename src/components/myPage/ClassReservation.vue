<template>
    <div>
        <div>
            <span class="list-header">예약 내역</span>
        </div>
        <hr>
        <div class="row">
            <div class="col-2"><strong>예약 번호</strong></div>
            <div class="col-4"><strong>수업 이름</strong></div>
            <div class="col-2"><strong>수업 날짜</strong></div>
            <div class="col-2"><strong>결제 금액</strong></div>
            <div class="col-2"><strong>예약 날짜</strong></div>
        </div>
        <div class="row text-center" v-for="reservation in reservations" :key="reservation.id">
            <div class="col-2">
                <a href="#" class="list-link" @click="handleDetail(reservation.reservationNumber)">{{ reservation.reservationNumber }}</a>
            </div>
            <div class="col-4">
                <a href="#" class="list-link" @click="handleDetail(reservation.reservationNumber)">{{ reservation.className }}</a>
            </div>
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
                { id: 1, reservationNumber: 'R20230001', className: '스테인드글라스 클래스', classDate: '2023-02-01', paymentAmount: 15000, reservationDate: '2023-01-15' },
                { id: 2, reservationNumber: 'R20230002', className: '글라스 클래스', classDate: '2023-02-05', paymentAmount: 20000, reservationDate: '2023-01-20' },
            ],    
        }
    },
    methods: {
        handleDetail(reservationNumber) {
            const tab = "DetailReservation";
            this.$emit('change-tab', tab, reservationNumber);
        },
    },
    emits: ['change-tab'],
};
</script>

<style scoped>
.list-header {
    font-size: 1.5rem;
    font-weight: bold;
}
.row {
    margin-bottom: 10px;
}
.row strong {
    display: block;
    text-align: center;
}
.list-link {
    color: #000000;
    text-decoration: none;
}
.list-link:hover {
    text-decoration: underline;
}
</style>