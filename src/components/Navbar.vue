<template>
    <nav :class="navbarClasses" id="mg-global-navbar">
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
                            <li><h6 class="dropdown-header">Support</h6></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" id="notice" href="#">Notice</a></li>
                            <li><a class="dropdown-item" id="shipping" href="#">Shipping</a></li>
                            <li><a class="dropdown-item" id="faq" href="#">FAQ</a></li>
                            <li><a class="dropdown-item" id="contact" href="#">Contact</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';

export default {
    data() {
        return {
            brandLogoURL: process.env.VUE_APP_BRAND_NAVBAR_LOGO_URL,
        }
    },
    setup() {
        const opacity = ref(0);

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
            if (scrollY >= 10) {
                opacity.value = 0.8;
            }
        };
        onMounted(() => {
            window.addEventListener('scroll', handleScroll);
        });
        onUnmounted(() => {
            window.removeEventListener('scroll', handleScroll);
            console.log(process.env.VUE_APP_BRAND_NAVBAR_LOGO_URL);
        });
        return {
            navbarClasses,
            opacity,
        };
    },
    computed: {
        currentPath() {
            return window.location.pathname;
        }
    },
    methods: {
        isActive(path) {
            return this.currentPath.includes(path);
        }
    }
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

