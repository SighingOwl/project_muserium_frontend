<template>
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <h2>주문 내역</h2>
                <ul>
                    <li v-for="order in orders" :key="order.id">
                        {{ order.description }} - {{ order.date }}
                    </li>
                </ul>
            </div>
            <div class="col-md-6">
                <h2>클래스 내역 예약</h2>
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
};
</script>

<style scoped>
.container {
    margin-top: 20px;
}
</style>