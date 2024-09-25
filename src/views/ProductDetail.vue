<template>
    <div class="container">
        <div v-if="productItem" class="row justify-content-between">
            <!-- Product Detail Start -->
            <!-- Product Image -->
            <div class="col-md-5">
                <img :src="productItem.image_url" class="img-fluid" alt="Product Image">
            </div>
            <!-- Product Information -->
            <div class="col-md-5 mb-5">
                <div class="card border-0">
                    <div class="card-body">
                        <h5 class="card-title">{{ productItem.title }}</h5>
                        <p class="card-text">{{ productItem.short_description }}</p>
                        <!-- Price and Like, Share -->
                        <div class="d-flex justify-content-between">
                            <div class="price-tag">
                                <p v-if="productItem.discount_rate" class="card-text" >
                                    <span class="text-muted text-decoration-line-through">{{ formattedOriginPrice }}원</span>
                                    <br>
                                    <span class="cur_price">{{ productItem.discount_rate }}% {{ formattedDiscountedPrice }}원</span>
                                </p>
                                <p v-else class="card-text cur_price" >
                                    <span>{{ formattedOriginPrice }}원</span>
                                </p>
                            </div>
                            <!-- Like, Share -->
                            <div class="like-share">
                                <a v-if="!isLike" class="me-1 btn like-btn" @mouseover="onLike = true" @mouseleave="onLike = false" @click="handleLike">
                                    <i :class="onLike ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                                </a>
                                <a v-else class="me-1 btn like-btn" @mouseover="onLike = true" @mouseleave="onLike = false" @click="handleLike">
                                    <i class='bi bi-heart-fill'></i>
                                </a>
                                <a class="btn share-btn" @mouseover="onShare = true" @mouseleave="onShare = false" @click="choosePlatform">
                                    <i :class="onShare ? 'bi bi-share-fill' : 'bi bi-share'"></i>
                                </a>
                            </div>    
                        </div>
                        <div>
                            <div v-if="showSharePlatform" class="d-flex justify-content-center mt-2">
                                <button class="btn me-2" @click="handleShare('facebook')">
                                    <i class="bi bi-facebook like-share-icon"></i>
                                </button>
                                <button class="btn me-2 like-share-icon" @click="handleShare('instagram')">
                                    <i class="bi bi-instagram"></i>
                                </button>
                                <button class="btn me-2 like-share-icon" @click="handleShare('twitter-x')">
                                    <i class="bi bi-twitter-x"></i>
                                </button>
                                <button class="btn" @click="handleShare('kakao')">
                                    kakao
                                </button>
                            </div>
                        </div>
                        <!-- Purchase Area -->
                        <hr class="mt-4">
                        <div class="d-flex justify-content-end mt-3">
                            <button class="btn btn-dark" @click="buyProduct">Buy Now</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Product Detail End -->
            <!-- Product Information Nav Start -->
            <div class="container mt-5" id="product_info" ref="product_info_container">
                <ul class="nav nav-underline row d-flex justify-content-center" id="product_info_nav" ref="product_info_nav">
                    <li class="nav-item col-md-2" id="product_info_nav_list">
                        <a class="nav-link text-black" id="product_info_nav_link" :class="{ active: activeTab === 'details'}" @click="setActiveTap('details')">상세정보</a>
                    </li>
                    <li class="nav-item col-md-2">
                        <a class="nav-link text-black" id="product_info_nav_link" :class="{ active: activeTab === 'reviews'}" @click="setActiveTap('reviews')">상품 리뷰</a>
                    </li>
                    <li class="nav-item col-md-2">
                        <a class="nav-link text-black" id="product_info_nav_link" :class="{ active: activeTab === 'qna'}" @click="setActiveTap('qna')">Q&A</a>
                    </li>
                    <li class="nav-item col-md-2">
                        <a class="nav-link text-black" id="product_info_nav_link" :class="{ active: activeTab === 'notice'}" @click="setActiveTap('notice')">배송 / 교환 안내</a>
                    </li>
                </ul>
            </div>
            <!-- Product Information Nav End -->
            <!-- Product Information Start -->
            <div>
                <component :is="currentTabComponent" :productItem="productItem" :activeTab="activeTab"></component>
            </div>
            <!-- Product Information End -->
        </div>
        <div v-else class="text-center loading-area">
            <div class="spinner-border mb-3" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p>상품 정보를 불러오는 중 입니다.</p>
            <p>로딩이 길어지면 새로고침을 해주세요.</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import DetailInfo from '../components/detailPage/DetailInfo.vue';
import Reviews from '../components/detailPage/Reviews.vue';
import QnA from '../components/detailPage/QnA.vue';
import Notice from '../components/detailPage/Notice.vue';

export default {
    props: {
        productID: {
            required: true,
        },
    },
    data() {
        return {
            productItem: null,

            /* like, share */
            onLike: false,
            onShare: false,
            isLike: false,
            showSharePlatform: false,

            /* product information nav */
            activeTab: 'details',
            navTop: 0,
        };
    },
    mounted() {
        /* Initialize product detail page */
        this.getProductDetail();
        this.getIsLiked();

        /* Fixed navigation */
        this.setFixedNavWidth();
        window.addEventListener('resize', this.setFixedNavWidth);
        window.addEventListener('scroll', this.handleScroll);
    },
    computed: {
        discountedPrice() {
            if (this.productItem && this.productItem.discount_rate) {
                return this.productItem.price * (1 - this.productItem.discount_rate / 100);
            }
        },
        formattedOriginPrice() {
            if (this.productItem.price) {
                return this.productItem.price.toLocaleString();
            }
        },
        formattedDiscountedPrice() {
            return this.discountedPrice.toLocaleString();
        },
        currentTabComponent() {
            switch (this.activeTab) {
                case 'details':
                    return DetailInfo;
                case 'reviews':
                    return Reviews;
                case 'qna':
                    return QnA;
                case 'notice':
                    return Notice;
            }
        }
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.setFixedNavWidth);
    },
    methods: {
        /* Initialize product detail page */
        async getProductDetail() {
            await axios
                .get(`${process.env.VUE_APP_API_URL}shop/detail/get_product_detail/`, {
                    params: {
                        id: this.productID,
                    },
                })
                .then((response) => {
                    if (response.status === 200) {
                        this.productItem = response.data;
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.status === 404) {
                        this.$router.push({ name: 'NotFound' });
                    } else if (error.response && error.response.status === 401) {
                        this.$router.push({ name: 'Unauthorized' });
                    } else {
                        console.error(error.response);
                    }
                });
        },
    
        /* Like, Share */
        async handleLike() {
            if (!localStorage.getItem('accessToken')) {
                alert('로그인이 필요한 서비스입니다.');
                this.$router.push({ name: 'Login' });
                return;
            }


            this.isLike = !this.isLike;
            await axios
                .post(`${process.env.VUE_APP_API_URL}common/like/like_product/`, {
                    is_like: this.isLike,
                }, {
                    params: {
                        product_id: this.productID,
                    },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    withCredentials: true,
                })
                .then((response) => {
                    if (response.status === 200) {
                        alert(response.data.message);
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.status === 404) {
                        this.$router.push({ name: 'NotFound' });
                    } else if (error.response && error.response.status === 401) {
                        this.$router.push({ name: 'Unauthorized' });
                    } else {
                        console.error(error.response);
                    }
                });
        },
        async getIsLiked() {
            if (!localStorage.getItem('accessToken')) {
                return;
            }

            await axios
                .get(`${process.env.VUE_APP_API_URL}common/like/is_like_product/`, {
                    params: {
                        product_id: this.productID,
                    },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    withCredentials: true,
                })
                .then((response) => {
                    if (response.status === 200) {
                        this.isLike = response.data.is_like;
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.status === 404) {
                        this.$router.push({ name: 'NotFound' });
                    } else if (error.response && error.response.status === 401) {
                        this.$router.push({ name: 'Unauthorized' });
                    } else {
                        console.error(error.response);
                    }
                });
        },
        choosePlatform() {
            this.showSharePlatform = !this.showSharePlatform;
        },
        isMobileDevice(){
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        copyToClipboard() {
            const textarea = document.createElement('textarea');
            textarea.value = window.location.href;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        },
        handleShare(platform) {
            const shareUrl = window.location.href;
            const sendText = `${this.productItem.title} 상품을 확인해보세요!`;
            
            if (this.isMobileDevice() && navigator.share) {
                navigator.share({
                    title: this.productItem.title,
                    text: sendText,
                    url: shareUrl,
                })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing:', error));
                
            } else {
                // Web Share API가 지원되지 않는 경우 기존 방식 사용
                if (platform === 'facebook') {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, 'facebook-share-dialog', 'width=626,height=436');
                } else if (platform === 'instagram') {
                    this.copyToClipboard();
                    alert('상품 링크가 복사되었습니다. 인스타그램 앱에서 붙여넣기하여 공유해주세요.');
                } else if (platform === 'twitter-x') {
                    window.open(`https://twitter.com/intent/tweet?text=${sendText}&url=${shareUrl}`, 'twitter-share-dialog', 'width=626,height=436');
                } else if (platform === 'kakao') {
                    alert('Kakao 공유하기');
                }
            }
            
        },

        /* Buy Product */
        buyProduct() {
            alert(`Product purchased: ${this.productItem.title}`);
        },

        /* Information Nav */
        setActiveTap(tab) {
            this.activeTab = tab;
        },
        handleScroll() {
            const nav = document.getElementById('product_info_nav');
            const scrollY = window.scrollY;
            const navbarHeight = document.querySelector('.navbar').offsetHeight;

            if (this.navTop === 0) {
                this.navTop = nav.offsetTop;
            }

            if (nav.style.width === '') {
                this.setFixedNavWidth();
            }

            if (scrollY >= this.navTop - navbarHeight) {
                nav.classList.add('fixed-nav');
                nav.style.top = `${navbarHeight}px`;
            } else {
                nav.classList.remove('fixed-nav');
                nav.style.top = 'initial';
            }
        },
        setFixedNavWidth() {
            const container = this.$refs.product_info_container;
            const fixedNav = this.$refs.product_info_nav;
            if (container && fixedNav) {
                fixedNav.style.width = `${container.offsetWidth}px`;
            }
        }
    },
};
</script>

<style scoped>
/* Product Detail */
.cur_price {
    font-size: 1.3rem;
}

.like-share {
    font-size: 1.5rem;
    text-decoration: none;
}

.like-btn {
    color: #ff0000;
}

.share-btn {
    color: #0000ff;
}

.like-share-icon {
    font-size: 2rem;
}

.bi-facebook:hover {
    color: #0766ff;
}

.bi-instagram:hover {
    color: #ff0000;
}

.bi-twitter-x:hover {
    color: #ffffff;
    background-color: #000000;
}

.popover {
    z-index: 1500 !important;
}

/* Product Information Nav */
#product_info_nav_link {
    text-align: center;
}

.fixed-nav {
    position: fixed;
    z-index: 1000;
    background-color: #ffffff;
}

/* Loading */
.loading-area {
    margin-top: 30%;
}
</style>