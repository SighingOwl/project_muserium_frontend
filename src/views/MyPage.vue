<template>
    <div class="container mypage-container">
        <div class="row">
            <div class="col-3">
                <nav class="nav flex-column">
                    <a class="nav-link" href="#" :class="{ active: activeTab === 'SummaryUser' }" @click="showComponent('SummaryUser')">마이페이지</a>
                    <a class="nav-link" href="#" :class="{ active : activeTab === 'OrderHistory' }" @click="showComponent('OrderHistory')">주문 내역</a>
                    <a class="nav-link" href="#" :class="{ active : activeTab === 'ClassReservation' }" @click="showComponent('ClassReservation')">클래스 예약 내역</a>
                    <a class="nav-link" href="#" :class="{ active : activeTab === 'EditProfile' }" @click="showComponent('EditProfile')">회원정보 수정</a>
                    <a class="nav-link" href="/support/">고객지원</a>
                </nav>
            </div>
            <div class="col-9">
                <component :is="currentTabComponent" :activeTab="activeTab"></component>
            </div>
        </div>
    </div>
</template>

<script>
import SummaryUser from '../components/myPage/SummaryUser.vue';
import OrderHistory from '../components/myPage/OrderHistory.vue';
import ClassReservation from '../components/myPage/ClassReservation.vue';
import EditProfile from '../components/myPage/EditProfile.vue';

export default {
    data() {
        return {
            activeTab: 'SummaryUser',
        };
    },
    computed: {
        currentTabComponent() {
            switch(this.activeTab) {
                case 'SummaryUser':
                    return SummaryUser;
                case 'OrderHistory':
                    return OrderHistory;
                case 'ClassReservation':
                    return ClassReservation;
                case 'EditProfile':
                    return EditProfile;
            }
        }
    },
    components: {
        SummaryUser,
        OrderHistory,
        ClassReservation,
        EditProfile,
    },
    methods: {
        showComponent(componentName) {
            this.activeTab = componentName;
        }
    }
};
</script>

<style scoped>
.mypage-container {
    margin-top: 10em;
    margin-bottom: 10em;
}

.nav-link {
    font-size: 1.2rem;
    color: #808080;
    cursor: pointer;
}

.nav-link:hover {
    color: #000000;
}

.active {
    color: #000000;
    text-decoration: underline;
}
</style>