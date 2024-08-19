<template>
    <!-- Main banner Start -->
    <div class="container-fluid no-padding">
        <div id="main-banner-carousel" class="carousel slide carousel-fade w-100 mx-auto bg-transparent" data-bs-ride="carousel">
            <div v-if="carousels.length" class="carousel-indicators">
                <button v-for="(carousel, index) in carousels" :key="index" type="button" :data-bs-target="'#main-banner-carousel'" :data-bs-slide-to="index" :class="{ active: index === activeIndex }" :aria-current="index === activeIndex ? 'true' : 'false'" :aria-label="carousel.alt"></button>
            </div>
            <div v-if="carousels.length" class="carousel-inner carousel-height">
                <div v-for="(carousel, CarouselIndex) in carousels" :key="CarouselIndex" :class="['carousel-item', { active: CarouselIndex === 0 }]" :style="{ backgroundColor: carousel.background_color}">
                    <div v-if="loading[CarouselIndex]" class="d-flex justify-content-center align-items-center carousel-img-size">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <img :src="carousel.image_url" class="d-block mx-auto carousel-img-size img-fluid" id="carousel-img" :alt="carousel.alt" loading="lazy" @load="setBackgroundColor">
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#main-banner-carousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">이전</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#main-banner-carousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">다음</span>
            </button>
        </div>
    </div>
    <!-- Main banner End -->
    <!-- Brand Title Start -->
    <div>
        <h1 class="text-center mt-5">Muserium Glass</h1>
        <p class="text-center">유리가 있고 영감이 떠오르는 곳 / A place with glass and inspiration.</p>
    </div>
    <!-- Brand Title End -->
    <!-- Card Area Start-->
    <div class="container mt-5">
        <div class="row row-cols-1 row-cols-md-4 g-4">
            <div v-if="cards.length" v-for="(card, index) in cards" :key="index" class="col">
                <div class="card h-100">
                    <img :src="card.image_url" class="card-img-top" :alt="card.alt" loading="lazy">
                    <div class="card-body">
                        <h5 class="card-title">{{ card.title }}</h5>
                        <a :href="card.url" class="btn btn-dark">{{ getButtonText(card) }}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Card Area End-->
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            carousels: [],
            cards: [],
            activeIndex: 0,
            activeImg: null,
            loading: [],
        };
    },
    mounted() {
        this.fetchCarouselData();
        this.fetchCardData();
        const carouselElement = document.getElementById('main-banner-carousel');
        carouselElement.addEventListener('slide.bs.carousel', (event) => {
            this.setActiveIndex(event.to);
        });
        this.loading = this.carousels.map(() => true);
    },
    methods: {
        fetchCarouselData() {
            axios.get('https://localhost:8000/api/carousels/')
                .then(response => {
                    this.carousels = response.data;
                })
                .catch(error => {
                    console.error("Failed to fetch carousel data", error);
                });
        },
        fetchCardData() {
            axios.get('https://localhost:8000/api/cards/')
                .then(response => {
                    this.cards = response.data;
                })
                .catch(error => {
                    console.error("Failed to fetch card data", error);
                });
        },
        setActiveIndex(index) {
            this.activeIndex = index;
            this.activeImg = this.carousels[index];
        },
        getButtonText(card) {
            // 카드 타이틀에 따라 버튼 텍스트를 반환
            if (card.title === 'One Day Class') {
                return 'Explore';
            } else if (card.title === 'Shop') {
                return 'Buy Now';
            } else if (card.title === 'Support') {
                return 'Contact Us';
            } else {
                return 'Learn More';
            }
        }
    }
}
</script>

<style scoped>
/* Main Page Carousel */
.carousel-height {
    max-height: 500px;
}

.carousel-img-size {
    max-height: 500px;
    object-fit: cover;
}

.carousel-item {
    transition: background-color 0.5s ease;
}

.no-padding {
    padding: 0 !important;
}
</style>