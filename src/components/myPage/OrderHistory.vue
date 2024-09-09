<template>
    <div>
        <div >
            <span class="list-header">주문 내역</span>
        </div>
        <hr>
        <div class="row">
            <div class="col-3"><strong>주문 번호</strong></div>
            <div class="col-3"><strong>주문 내역</strong></div>
            <div class="col-2"><strong>결제 금액</strong></div>
            <div class="col-2"><strong>주문 날짜</strong></div>
            <div class="col-2"><strong>주문 상태</strong></div>
        </div>
        <div class="row text-center" v-for="order in orders" :key="order.id">
            <div class="col-3">
                <a href="#" class="list-link" @click="handleDetail(order.orderNumber)">{{ order.orderNumber }}</a>
            </div>
            <div class="col-3">
                <a href="#" class="list-link" @click="handleDetail(order.orderNumber)">{{ order.orderDetails }}</a>
            </div>
            <div class="col-2">{{ order.paymentAmount }}</div>
            <div class="col-2">{{ order.orderDate }}</div>
            <div class="col-2">
                <a v-if="order.orderStatus === '배송중'" href="#" class="list-link" @click="getShippingInfo(order.waybill)">{{ order.orderStatus }}</a>
                <span v-else>{{ order.orderStatus }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            orders: [
                { id: 1, orderNumber: '20230001', orderDetails: '주문 1', quantity: 1, paymentAmount: 10000, orderDate: '2023-01-01', orderStatus: '배송중', waybill: '1234567890' },
                { id: 2, orderNumber: '20230002', orderDetails: '주문 2', quantity: 2, paymentAmount: 20000, orderDate: '2023-01-02', orderStatus: '배송완료', waybill: '1234567891' },
            ],    
        }
    },
    methods: {
        getShippingInfo(waybill) {
            window.open(
                `http://nplus.doortodoor.co.kr/web/detail.jsp?slipno=${waybill}`,
                'popupWindow',
                'width=700,height=600,scrollbars=yes'
            );
        },
        handleDetail(orderNumber) {
            const tab = "DetailOrder";
            this.$emit('change-tab', tab, orderNumber);
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