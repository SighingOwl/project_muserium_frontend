<template>
    <div class="container-fluid">
        <!-- Carousel -->
        <div id="topClassesCarousel" class="carousel slide w-100" data-bs-ride="carousel">
            <div v-if="topClasses.length" class="carousel-indicators">
                <button v-for="(classItem, index) in topClasses" :key="index" type="button" :data-bs-target="'#topClassesCarousel'" :data-bs-slide-to="index" :class="{ active: index === activeIndex}" :aria-current="index === activeIndex ? 'true' : 'false'" :aria-label="'Slide' + (index + 1)"></button>
            </div>
            <div class="carousel-inner">
                <div class="carousel-item" :class="{ active: index === 0 }" v-for="(classItem, index) in topClasses" :key="classItem.id">
                    <div class="d-flex justify-content-center align-items-center">
                        <img :src="classItem.image_url" class=" img-fluid carousel-img" alt="Class Image">
                        <div class="ms-4">
                            <h5>{{ classItem.title }}</h5>
                            <p>{{ classItem.short_description }} ddddddfasdfkljasdfkl;jalsjd</p>
                            <a :href="classItem.id" class="btn btn-dark mt-3">Learn More</a>
                        </div>
                        
                    </div> 
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#topClassesCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next carousel-button" type="button" data-bs-target="#topClassesCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </div>
    <div class="container">
        <div class="col-md">
            <div class="d-flex justify-content-between align-items-center mb-3 card-header">
                <div>
                    Total {{ classes.length }} classes
                </div>
                <div>
                    <a href="#" @click.prevent="sortClasses('newest')" class="text-decoration-none text-black me-2">신상품</a>|
                    <a href="#" @click.prevent="sortClasses('title')" class="text-decoration-none text-black me-2">상품명</a>|
                    <a href="#" @click.prevent="sortClasses('priceLow')" class="text-decoration-none text-black me-2">낮은 가격</a>|
                    <a href="#" @click.prevent="sortClasses('priceHigh')" class="text-decoration-none text-black me-2">높은 가격</a>|
                    <a href="#" @click.prevent="sortClasses('recommended')" class="text-decoration-none text-black">추천순</a>
                </div>
            </div>
            <hr class="my-4">
        </div>
        <div class="row">
            <div class="col-md">
                <div class="row">
                    <div class="col-md-4 mb-4" v-for="(classItem, index) in classes" :key="classItem.id">
                        <div class="card no-border">
                            <div class="my-2 mx-2">
                                <img :src="classItem.image_url" class="card-img-top card-img-size img-fluid" alt="Class Image">
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">{{ classItem.title }}</h5>
                                <p class="card-text">{{ classItem.short_description }}</p>
                                
                                <div class="d-flex justify-content-between">
                                    <span class="card-text ms-2">
                                        <i class="bi bi-hand-thumbs-up"></i> {{ classItem.likes }}
                                        <i class="bi bi-star-fill"></i> {{ classItem.interests }}
                                    </span>
                                    <a :href="classItem.id" class="btn btn-dark ms-2">Learn More</a>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            searchQuery: '',
            selectedCategory: '',
            classes: [],
            topClasses: [],
            activeIndex: 0,
        };
    },
    computed: {
        categories(){
            const catogories = this.classes.map(classItem => classItem.category);
            return [...new Set(catogories)];
        }
    },
    mounted() {
        this.fetchClassesData();
        const carouselElement = document.getElementById('topClassesCarousel');
        carouselElement.addEventListener('slide.bs.carousel', (event) => {
            this.setActiveIndex(event.to);
        })
    },
    methods: {
        fetchClassesData() {
            axios.get('http://localhost:8000/class/api/classes/')
                .then(response => {
                    this.classes = response.data;
                    this.setTopClasses();
                })
                .catch(error => {
                    console.error("Failed to fetch class data", error);
                });
        },
        setTopClasses() {
            this.topClasses = this.classes
                .sort((a, b) => b.likes - a.likes || new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 4);
        },
        sortClasses(criteria) {
            if (criteria === 'newest') {
                this.classes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            } else if (criteria === 'title') {
                this.classes.sort((a, b) => a.title.localeCompare(b.title));
            } else if (criteria === 'priceLow') {
                this.classes.sort((a, b) => a.price - b.price);
            } else if (criteria === 'priceHigh') {
                this.classes.sort((a, b) => b.price - a.price);
            } else if (criteria === 'recommended') {
                this.classes.sort((a, b) => b.interests - a.interests);
            }
        },
        setActiveIndex(index) {
            this.activeIndex = index;
        }
    }
};
</script>

<style scoped>
.container-fluid {
    padding: 20px;
}

.carousel_img {
    max-width: 250px;
}
.carousel-control-prev-icon,
.carousel-control-next-icon {
    border-radius: 100%;
    display: inline-block;
    position: relative;
}
.carousel-control-prev-icon::before,
.carousel-control-next-icon::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-style: solid;
    transform: translate(-50%, -50%);
}
.carousel-control-prev-icon::before {
    border-width: 10px 15px 10px 0;
    border-color: transparent #000000 transparent transparent;
    /*border-color: transparent #ffd83c transparent transparent;*/
}
.carousel-control-next-icon::before {
    border-width: 10px 0 10px 15px;
    border-color: transparent transparent transparent #000000;
    /*border-color: transparent transparent transparent #ffd83c;*/
}

.card {
    margin-bottom: 20px;
}
.card-header {
    font-size: 13px;
    opacity: 0.5;
}
.card-img-size {
    width: 100%;
    object-fit: cover;
}

.bi-star-fill {
    color: #ffdd00;
}

.no-border {
    border: none;
}

</style>
