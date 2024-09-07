<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <h2>주문 내역</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-2"><strong>주문 번호</strong></div>
            <div class="col-2"><strong>주문 내역</strong></div>
            <div class="col-2"><strong>주문 수량</strong></div>
            <div class="col-2"><strong>결제 금액</strong></div>
            <div class="col-2"><strong>주문 날짜</strong></div>
            <div class="col-2"><strong>주문 상태</strong></div>
        </div>
        <div class="row text-center" v-for="order in orders" :key="order.id">
            <div class="col-2">{{ order.orderNumber }}</div>
            <div class="col-2">{{ order.orderDetails }}</div>
            <div class="col-2">{{ order.quantity }}</div>
            <div class="col-2">{{ order.paymentAmount }}</div>
            <div class="col-2">{{ order.orderDate }}</div>
            <div class="col-2">{{ order.orderStatus }}</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            orders: [
                { id: 1, orderNumber: '20230001', orderDetails: '주문 1', quantity: 1, paymentAmount: 10000, orderDate: '2023-01-01', orderStatus: '배송중' },
                { id: 2, orderNumber: '20230002', orderDetails: '주문 2', quantity: 2, paymentAmount: 20000, orderDate: '2023-01-02', orderStatus: '배송완료' },
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