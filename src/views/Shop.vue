<template>
    <div class="container-fluid">
        <!-- Carousel Start -->
        <div v-if="topProducts.length" id="topProductsCarousel" class="carousel slide w-100" data-bs-ride="carousel">
            <div class="carousel-indicators">
                <button v-for="(productItem, index) in topProducts" :key="index" type="button" :data-bs-target="'#topProductsCarousel'" :data-bs-slide-to="index" :class="{ active: index === activeIndex}" :aria-current="index === activeIndex ? 'true' : 'false'" :aria-label="'Slide' + (index + 1)"></button>
            </div>
            <div class="carousel-inner">
                <div class="carousel-item" :class="{ active: index === 0 }" v-for="(productItem, index) in topProducts" :key="productItem.id">
                    <div class="d-flex justify-content-center align-items-center">
                        <img :src="productItem.image_url" class=" img-fluid carousel-img" alt="Product Image">
                        <div class="ms-4">
                            <h5>{{ productItem.title }}</h5>
                            <p>{{ productItem.short_description }}</p>
                            <router-link :to="{ name: 'ProductDetail', params: { productID: productItem.id } }" class="btn btn-dark ms-2">Learn More</router-link>
                        </div>
                    </div> 
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#topProductsCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next carousel-button" type="button" data-bs-target="#topProductsCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
        <div v-else>
            <div class="d-flex flex-column justify-content-center align-items-center carousel-loading">
                <div class="spinner-border text-dark" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="mt-3">
                    <span class="ms-2">추천 상품을 불러오는 중 입니다...</span>
                </div>
            </div>
        </div>
    </div>
    <!-- Carousel End -->
    <!-- Product List Start -->
    <div class="container">
        <div class="col-md">
            <div class="d-flex justify-content-between align-items-center mb-3 card-header">
                <div class="content-count">
                    <span>Total </span>
                    <span class="fw-bold text-black">{{ productData.count || 0}}</span>
                    <span> products</span>
                </div>
                <div class="sort-links">
                    <a href="#" @click.prevent="sortProducts('newest')" class="text-decoration-none me-2" :class="{ 'active': activeCriteria === 'newest'}">신상품</a>|
                    <a href="#" @click.prevent="sortProducts('rating')" class="text-decoration-none me-2" :class="{ 'active': activeCriteria === 'rating'}">평점순</a>|
                    <a href="#" @click.prevent="sortProducts('recommended')" class="text-decoration-none me-2" :class="{ 'active': activeCriteria === 'recommend' }">추천순</a>|
                    <a href="#" @click.prevent="sortProducts('title')" class="text-decoration-none me-2" :class="{ 'active': activeCriteria === 'title' }">상품명</a>|
                    <a href="#" @click.prevent="sortProducts('priceLow')" class="text-decoration-none me-2" :class="{ 'active': activeCriteria === 'priceLow' }">낮은 가격</a>|
                    <a href="#" @click.prevent="sortProducts('priceHigh')" class="text-decoration-none" :class="{ 'active': activeCriteria === 'priceHigh' }">높은 가격</a>
                </div>
            </div>
            <hr class="my-4">
        </div>
        <div v-if="productData.length" class="row">
            <div class="col-md">
                <div class="row">
                    <div v-for="(productItem, index) in productData.results" :key="productItem.id" class="col-md-4 mb-4">
                        <div class="card no-border">
                            <div class="my-2 mx-2">
                                <img :src="productItem.image_url" class="card-img-top card-img-size img-fluid" alt="Product Image">
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">{{ productItem.title }}</h5>
                                <p class="card-text">{{ productItem.short_description }}</p>
                                <div class="d-flex justify-content-between">
                                    <span class="card-text ms-2">
                                        <i class="bi bi-hand-thumbs-up"></i> {{ productItem.likes }}
                                        <i class="bi bi-star-fill"></i> {{ productItem.average_rating }}
                                    </span>
                                    <router-link :to="{ name: 'ProductDetail', params: { productID: productItem.id } }" class="btn btn-dark ms-2">Learn More</router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="text-center no-contents">
                <span>
                    <i class="bi bi-chat-heart"></i>
                </span>
                <p>추가 될 상품을 기다려주세요!</p>
            </div>
        </div>
        <!-- Paginator Start -->
        <div class="paginator d-flex justify-content-center align-items-center" ref="paging">
            <button v-if="productData.previous" @click="handlePrevClick" class="btn btn-outline-dark mx-2">< 이전</button>
            <button v-for="pageNumber in displayedPages" :key="pageNumber" @click="goToPage(pageNumber)" :class="['btn', 'btn-outline-dark', 'mx-2', { 'active': pageNumber === page }]">
                {{ pageNumber }}
            </button>
            <button v-if="productData.next" @click="handleNextClick" class="btn btn-outline-dark mx-2">다음 ></button>
        </div>
        <!-- Paginator End -->
    </div>
    <!-- Product List End -->
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            searchQuery: '',
            selectedCategory: '',
            topProducts: [],
            productData: [],
            sortBy: '-created_at',
            page: 1,
            pagesPerGroup: 6,
            currentPageGroup: 0,
            activeIndex: 0,
            activeCriteria: 'newest',
        };
    },
    computed: {
        categories(){
            const categories = this.products.map(productItem => productItem.category);
            return [...new Set(categories)];
        },
        displayedPages() {
            const start = this.currentPageGroup * this.pagesPerGroup;
            const end = start + Math.min(this.pagesPerGroup, this.productData.total_pages);

            const page_range = []
            for (let i = start + 1; i < end; i++) {
                page_range.push(i);
            }

            return page_range;
        },
        maxPageGroup() {
            return Math.ceil(this.productData.total_pages / this.pagesPerGroup) - 1;
        }
    },
    mounted() {
        this.getTopProducts();
        this.getProductsList();

        if (this.topProducts.length) {
            const carouselElement = document.getElementById('topProductsCarousel');
            carouselElement.addEventListener('slide.bs.carousel', (event) => {
                this.setActiveIndex(event.to);
            })    
        }
    },
    methods: {
        async getTopProducts() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_URL}product/products/list_top_products/`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    this.topProducts = response.data;
                } else {
                    console.error("Failed to fetch top product data", response.status);
                }
            } catch (error) {
                console.error("Failed to fetch top product data", error);
            }
        },
        async getProductsList() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_URL}product/products/list_products/`, {
                    params: {
                        page: this.page,
                        page_size: this.pagesPerGroup,
                        sort_by: this.sortBy
                    },
                    withCredentials: true
                })

                if (response.status === 200) {
                    this.productData = response.data;
                } else {
                    console.error("Failed to fetch product data", response.status);
                }
            } catch (error) {
                console.error("Failed to fetch product data", error);
            }
        },
        async sortProducts(criteria) {
            if (criteria === 'newest') {
                this.sortBy = '-created_at';
                this.activeCriteria = 'newest';
                await this.getProductsList();
            } else if (criteria === 'title') {
                this.sortBy = 'title';
                this.activeCriteria = 'title';
                await this.getProductsList();
            } else if (criteria === 'priceLow') {
                this.sortBy = 'price';
                this.activeCriteria = 'priceLow';
                await this.getProductsList();
            } else if (criteria === 'priceHigh') {
                this.sortBy = '-price';
                this.activeCriteria = 'priceHigh';
                await this.getProductsList();
            } else if (criteria === 'recommended') {
                this.sortBy = '-likes';
                this.activeCriteria = 'recommended';
                await this.getProductsList();
            } else if (criteria === 'rating') {
                this.sortBy = '-average_rating';
                this.activeCriteria = 'rating';
                await this.getProductsList();
            }
        },
        setActiveIndex(index) {
            this.activeIndex = index;
        },
        async handlePrevClick() {
            if (this.productData.previous && this.page % this.pagesPerGroup === 1) {
                await this.prevPageGroup();
            } else {
                await this.prevPage();
            }
            this.scrollToPaginator();
        },
        async handleNextClick() {
            if (this.productData.next && this.page % this.pagesPerGroup === 0) {
                await this.nextPageGroup();
            } else {
                await this.nextPage();
            }
            this.scrollToPaginator();
        },
        async goToPage(pageNumber) {
            this.page = pageNumber;
            await this.getProductsList();
            this.scrollToPaginator();
        },
        async prevPage() {
            if (this.productData.previous !== 'None') {
                this.page--;
                await this.getProductsList();
            }
        },
        async nextPage() {
            if (this.productData.next !== 'None') {
                this.page++;
                await this.getProductsList();
            }
        },
        async nextPageGroup() {
            if (this.currentPageGroup < this.maxPageGroup) {
                this.currentPageGroup++;
                await this.nextPage();
            }
        },
        async prevPageGroup() {
            if (this.currentPageGroup > 0) {
                this.currentPageGroup--;
                await this.prevPage();
            }
        },
        scrollToPaginator() {
            const paginatorElement = this.$refs.paging;
            if (paginatorElement) {
                paginatorElement.scrollIntoView({ behavior: 'smooth' });
            }
        },
    }
};
</script>

<style scoped>
/* carousel */
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

.carousel-loading {
    height: 300px;
}

/* product list */
.content-count {
    font-size: 0.8rem;
    color: #888888;
}

.sort-links a {
    font-size: 0.8rem;
    color: #888888;
}

.sort-links a:hover {
    color: #000000;
    cursor: pointer;
}

.sort-links a.active {
    color: #000000;
}

.card {
    margin-bottom: 20px;
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

.paginator .btn {
    border-radius: 0.15rem;
    border: none;
}

.paginator .btn.active{
    background-color: #000000;
    color: #ffffff;
}
</style>