<template>
    <div>
        <span class="header">주문 상세</span>
        <hr>
        <div class="row mb-3">
            <div class="col-md-2 list-header">
                <span>주문 번호</span>
            </div>
            <div class="col-md-4">
                {{ orderId }}
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-2 list-header">
                <span>주문 날짜</span>
            </div>
            <div class="col-md-4">
                {{ orderDate }}
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-2 list-header">
                <span>주문 상태</span>
            </div>
            <div class="col-md-4">
                <a v-if="orderStatus === '배송중'" href="#" class="list-link" @click="getShippingInfo(waybill)">{{ orderStatus }}</a>
                <span v-else>{{ orderStatus }}</span>
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
        <div class="row mb-3">
            <div class="col-md-2 list-header">
                <span>주문 내역</span>
            </div>
            <div class="container">
                <div class="row mb-2 text-center list-header">
                    <div class="col-md-3 offset-md-1 border-bottom border-3">
                        <span>상품명</span>
                    </div>
                    <div class="col-md-2 border-bottom border-3">
                        <span>수량</span>
                    </div>
                </div>
                <div v-for="item in orderItems" :key="item.id" class="row text-center mb-2">
                    <div class="col-md-3 offset-md-1 border-bottom">
                        {{ item.name }}
                    </div>
                    <div class="col-md-2 border-bottom">
                        {{ item.quantity }}
                    </div>
                </div>    
            </div>
        </div>
        <div class="d-flex justify-content-center mt-5">
            <button class="btn btn-outline-dark me-3" @click="cancelOrder">주문 취소</button>
            <button class="btn btn-outline-dark" @click="toOrderHistory">목록으로</button>
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
            orderDate: '2023-10-01',
            orderStatus: '배송중',
            waybill: '1234567890',
            paymentAmount: '50,000',
            orderItems: [
                { id: 1, name: '상품 A', quantity: 2 },
                { id: 2, name: '상품 B', quantity: 1 },
                { id: 3, name: '상품 C', quantity: 3 }
            ]
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
        cancelOrder() {
            // 주문 취소 로직
            alert('주문을 취소하시겠습니까?');
            alert('주문이 취소되었습니다.');
        },
        toOrderHistory() {
            this.$emit('change-tab', 'OrderHistory');
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
