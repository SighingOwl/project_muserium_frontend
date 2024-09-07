<template>
    <nav v-if="showNavbar" :class="navbarClasses" id="mg-global-navbar">
        <div class="container-fluid d-flex">
            <a class="navbar-brand mx-5 me-auto my-1" href="/">
                <img :src="brandLogoURL" alt="Musetium Logo" id="mg-nav-logo">
            </a>
            <button class="navbar-toggler ml-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav d-flex mx-5" id="mg-nav-items">
                    <li class="nav-item mx-4" :class="{ active: isActive('about_us/')}">
                        <a class="nav-link" id="mg-nav-brand" href="/about_us/">Brand</a>
                    </li>
                    <li class="nav-item mx-4" :class="{ active: isActive('class/')}">
                        <a class="nav-link" id="mg-nav-class" href="/class/">Class</a>
                    </li>
                    <li class="nav-item mx-4" :class="{ active: isActive('shop/')}">
                        <a class="nav-link" id="mg-nav-shop" href="/shop/">Shop</a>
                    </li>
                    <li class="nav-item dropdown mx-4">
                        <a class="nav-link dropdown-toggle no-arrow" :class="{ active: isActive('support/')}" id="mg-nav-support" href="/support/">Support</a>
                        <ul class="dropdown-menu">
                            <li><a href="#" class="dropdown-item" id="notice">Notice</a></li>
                            <li><a href="#" class="dropdown-item" id="shipping">Shipping</a></li>
                            <li><a href="#" class="dropdown-item" id="faq">FAQ</a></li>
                            <li><a href="#" class="dropdown-item" id="contact">Contact</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="collapse navbar-collapse d-flex justify-content-end me-5" id="navbarNav">
                <div class="d-flex justify-content-end">
                    <ul class="navbar-nav d-flex flex-row ml-auto">
                        <li v-if="!isLogin" class="nav-item me-3">
                            <a href="/login/" class="nav-link" id="mg-nav-login" >
                                <i class="fas fa-user"></i> Login
                            </a>
                        </li>
                        <li v-if="!isLogin" class="nav-item">
                            <a href="/signup/" class="nav-link" id="mg-nav-signup" >
                                <i class="fas fa-user-plus"></i> Sign Up
                            </a>
                        </li>
                        <li v-if="isLogin" class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle no-arrow" id="mg-nav-user">
                                <i class="fas fa-user"></i> {{ this.getUserInfo.name }} 님
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" id="myPage" @click="handleUserPage('mypage')">마이페이지</a></li>
                                <li><a class="dropdown-item" id="orderList" @click="handleUserPage('orderlist')">주문 내역</a></li>
                                <li><a class="dropdown-item" id="reserveList" @click="handleUserPage('reservelist')">클래스 예약 내역</a></li>
                            </ul>
                        </li>
                        <li v-if="isLogin" class="nav-item">
                            <a class="nav-link" id="mg-nav-logout" @click="logoutSubmit">
                                <i class="fas fa-sign-out-alt"></i> Logout
                            </a>
                        </li>
                    </ul>    
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
    data() {
        return {
            brandLogoURL: process.env.VUE_APP_BRAND_NAVBAR_LOGO_URL,
        };
    },
    setup() {
        const opacity = ref(0);
        const router = useRouter();

        const navbarClasses = computed(() => ({
            'navbar': true,
            'navbar-expand-lg': true,
            'fixed-top': true,
            'bg-white': true,
            'bg-opacity-75': opacity.value > 0.25,
            'transition-opacity': true,
        }));

        const handleScroll = () => {
            const scrollY = window.scrollY;
            opacity.value = scrollY > 0 ? 0.8 : 0;
        };

        const handleUserPage = (menu) => {
            router.push(`/my-page/`, {params: { menu } });
        };

        onMounted(() => {
            window.addEventListener('scroll', handleScroll);
        });

        onUnmounted(() => {
            window.removeEventListener('scroll', handleScroll);
        });

        return {
            opacity,
            navbarClasses,
            handleUserPage,
        };
    },
    computed: {
        showNavbar() {
            return this.$store.getters.getShowNavbar;
        },
        isLogin() {
            return this.$store.getters.getIsLogin;
        },
        getUserInfo() {
            return this.$store.getters.getUserInfo;
        },
        currentPath() {
            return window.location.pathname;
        },
    },
    methods: {
        isActive(path) {
            return this.currentPath.includes(path);
        },
        logoutSubmit() {
            this.$store.dispatch('logout')
                .then(() => {
                    this.$router.push('/');
                });
        },
    },
};
</script>

<style scoped>
#mg-nav-items {
    font-size: 1.5em;
}

#mg-nav-logo {
    max-width: 100px;
}

.nav-link {
    opacity: 0.7;
}

.nav-link:hover {
    opacity: 1;
}

.nav-item.active .nav-link {
    opacity: 1;
}

.nav-item.dropdown:hover .dropdown-menu {
    display: block;
}

.dropdown-toggle.no-arrow::after {
    display: none;
}

.transition-opacity {
    transition: opacity 0.5s ease;
}

.dropdown-item {
    opacity: 0.5;
}

.dropdown-item:hover {
    background-color: #FAF2D4;
    opacity: 1;
    transition: background-color 0.3s ease;
}

</style>

