<template>
    <div class="container mt-5" ref="reviewForm">
        <!-- Reviews List Start -->
        <div class="container mt-4">
            <div class="col-md">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="content-count">
                        <span>Total </span>
                        <span class="fw-bold text-black">{{ paginator.count || 0}}</span>
                        <span> reviews</span>
                    </div>
                    <div class="sort-links">
                        <a href="#" @click.prevent="sortReviews('newest')" class="text-decoration-none me-2" :class="{ 'active': activeCriteria === 'newest' }">최신순</a>|
                        <a href="#" @click.prevent="sortReviews('ratingHigh')" class="text-decoration-none me-2" :class="{ 'active': activeCriteria === 'ratingHigh' }">평점 높은순</a>|
                        <a href="#" @click.prevent="sortReviews('ratingLow')" class="text-decoration-none" :class="{ 'active': activeCriteria === 'ratingLow'}">평점 낮은순</a>
                    </div>
                </div>
            </div>
            <hr>
            <div v-if="reviews.length" class="mt-4">
                <div v-for="review in reviews" :key="review.id">
                    <div class="row">
                        <div class="col-md-8">
                            <p>{{ review.content }}</p>
                            <img v-if="review.image" :src="review.image" alt="review-image" class="img-fluid mb-2 review-img"/>
                            <div class="d-flex flew-wrap">
                                <div v-for="(additionalRating, index) in ratings(review)" :key="additionalRating" class="card m-2" :class="getRatingClass(additionalRating)" id="rating-tag-card">
                                    <div class="card-body p-1 d-flex justify-content-center align-items-center" >
                                        <span>{{ ratingTag(index, additionalRating) }}</span>
                                    </div>
                                </div>
                            </div>
                            <span class="me-1 review-info">{{ review.author }}</span>
                            <span class="review-info">{{ formatDate(review.created_at) }}</span>
                            <button type="button" class="btn btn-outline-dark ms-2" id="control-review-btn" @click="updateReview(review)">리뷰 수정</button>
                            <button type="button" class="btn btn-outline-dark ms-2" id="control-review-btn" @click="confirmDeleteReview(review)">리뷰 삭제</button>
                        </div>
                        <div class="review-rating col-md-4 border-start border-dark d-flex flex-column justify-content-center align-items-center">
                            <h4>{{ review.rating.toFixed(1) }} / 5.0</h4>
                            <div class="star-rating">
                                <span v-for="star in 5" :key="star" class="star" :style="getStarStyle(star, review.rating)">&#9733;</span>
                            </div>
                        </div>
                    </div>
                    <hr>
                </div>
                <!-- Paginator Start -->
                <div class="paginator d-flex justify-content-center align-items-center" ref="paging">
                    <button v-if="paginator.previous_page" @click="handlePrevClick" class="btn btn-outline-dark mx-2">< 이전</button>
                    <button v-for="pageNumber in displayedPages" :key="pageNumber" @click="goToPage(pageNumber)" :class="['btn', 'btn-outline-dark', 'mx-2', { 'active': pageNumber === page }]">
                        {{ pageNumber }}
                    </button>
                    <button v-if="paginator.next_page" @click="handleNextClick" class="btn btn-outline-dark mx-2">다음 ></button>
                </div>
                <!-- Paginator End -->
            </div>
            <div v-else>
                <div class="text-center no-contents">
                    <span>
                        <i class="bi bi-chat-heart"></i>
                    </span>
                    <p>리뷰를 기다려주세요!</p>
                </div>
            </div>
        </div>
        <!-- Reviews List End -->
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: ['classItem'],
    data() {
        return {
            /* pagination variables */
            paginator: [],
            page: 1,
            pageSize: 5,
            pageOrder: '',
            currentPageGroup: 0,
            pagesPerGroup: 5,

            /* review form variables */
            reviews: [],
            averageRating: 0,

            /* review sorting variables */
            activeCriteria: 'newest',
        }
    },
    computed: {
        displayedPages() {
            const start = this.currentPageGroup * this.pagesPerGroup;
            const end = start + this.pagesPerGroup;
            return this.paginator.page_range.slice(start, end);
        },
        maxPageGroup() {
            return Math.ceil(this.paginator.page_range.length / this.pagesPerGroup) - 1;
        }
    },
    async mounted() {
        await this.getReviews();
    },
    methods: {
        async getReviews() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_URL}common/reviews/read/class/`,{
                    params: {
                        glass_class_id: this.classItem.id,
                        page: this.page,
                        page_size: this.pageSize,
                        page_order: this.pageOrder,
                    },
                });
                if (response.status === 200) {
                    const reviewData = response.data;
                    this.reviews = reviewData.reviews;
                    this.paginator = reviewData.paginator;
                    this.averageRating = reviewData.average_rating;
                } else {
                    throw new Error('Failed to get reviews');
                }
            } catch (error) {
                console.error("There was a problem getting the reviews.", error);
            }
        },
        sortReviews(criteria) {
            this.activeCriteria = criteria;
            this.page = 1;
            if (criteria === 'newest') {
                this.pageOrder = '-created_at';
                this.getReviews();
            } else if (criteria === 'ratingHigh') {
                this.pageOrder = '-rating';
                this.getReviews();
            } else if (criteria === 'ratingLow') {
                this.pageOrder = 'rating';
                this.getReviews();
            }
        },

        /* Pagination Methods */
        async handlePrevClick() {
            if (this.page > 1 && this.page % this.pagesPerGroup === 1) {
                await this.prevPageGroup();
            } else {
                await this.prevPage();
            }
            this.scrollToPaginator();
        },
        async handleNextClick() {
            if (this.paginator.next_page && this.page % this.pagesPerGroup === 0) {
                await this.nextPageGroup();
            } else {
                await this.nextPage();
            }
            this.scrollToPaginator();
        },
        async goToPage(pageNumber) {
            this.page = pageNumber;
            await this.getReviews();
            this.scrollToPaginator();
        },
        async prevPage() {
            if (this.page > 1) {
                this.page--;
                await this.getReviews();
            }
        },
        async nextPage() {
            if (this.paginator.next_page !== 'None') {
                this.page++;
                await this.getReviews();
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

        formatDate(dateString) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit'};
            const date = new Date(dateString);
            return date.toLocaleDateString('ko-KR', options).replace(/\s/g, '');
        },

        /* Star Rating Methods */
        getStarStyle(star, rating) {
            const filledPercentage = Math.min(Math.max(rating - (star - 1), 0), 1) * 100;
            return {
                background: `linear-gradient(90deg, #000000 ${filledPercentage}%, #cccccc ${filledPercentage}%)`,
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent'
            };
        },

        /* review content */
        ratings(review){
            return [ review.teacher_rating, review.readiness_rating, review.content_rating ]
        },
        ratingTag(ratingIndex, rating) {
            if (ratingIndex === 0) {
                return this.teacherRatingTag(rating);
            } else if (ratingIndex === 1) {
                return this.readinessRatingTag(rating);
            } else if (ratingIndex === 2) {
                return this.contentRatingTag(rating);
            }
        },
        teacherRatingTag(rating) {
            if (rating === 1) {
                return '#강사님이 아쉬워요';
            } else if (rating === 2) {
                return '#강사님이 괜찮아요';
            } else if (rating === 3) {
                return '#강사님이 친절해요';
            }
        },
        readinessRatingTag(rating) {
            if (rating === 1) {
                return '#강의 준비가 미습해요';
            } else if (rating === 2) {
                return '#강의 준비가 나쁘지 않아요';
            } else if (rating === 3) {
                return '#강의 준비가 완벽해요';
            }
        },
        contentRatingTag(rating) {
            if (rating === 1) {
                return '#강의 내용이 아쉬워요';
            } else if (rating === 2) {
                return '#강의 내용이 들을만해요';
            } else if (rating === 3) {
                return '#강의 내용이 유익해요';
            }
        },
        getRatingClass(rating) {
            if (rating === 1) {
                return 'low-rating';
            } else if (rating === 2) {
                return 'medium-rating';
            } else if (rating === 3) {
                return 'high-rating';
            }
        },
    }
}
</script>

<style>
.review-rating-summary {
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Star Rating */
.star-rating {
    display: flex;
    align-items: center;
}

.star {
    color: #cccccc;
    position: relative;
    display: inline-block;
    width: 1em;
    height: 1em;
    line-height: 1em;
    margin-right: 0.1em;
}

.star::before {
    content: '★';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #cccccc;
}

.star::after {
    content: '★';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    color: #000000;
    overflow: hidden;
}

/* Review content */
.content-count {
    font-size: 0.8rem;
    color: #888888;
}

.sort-links {
    color: #888888;
}

.sort-links a {
    font-size: 0.8rem;
    color: #888888;
}

.sort-links a:hover {
    color: #000000;
    font-weight: bold;
    cursor: pointer;
}

.sort-links a.active {
    font-weight: bold;
    color: #000000;
}

.review-img {
    border-radius: 0.3rem;
    max-width: 20%;
    min-width: 20%;
}

#rating-tag-card {
    font-size: 0.8rem;
    width: 10rem;
    border-radius: 0.4rem;
}

.high-rating:hover {
    background-color: #b2ffb2;
    cursor: pointer;
    border: none;
}

.medium-rating:hover {
    background-color: #f7f700;
    cursor: pointer;
    border: none;
}

.low-rating:hover {
    background-color: #cccccc;
    cursor: pointer;
    border: none;
}

.review-info {
    font-size: 0.75rem;
    opacity: 0.8;
}

#control-review-btn {
    --bs-btn-padding-y: 0rem;
    --bs-btn-padding-x: .3rem;
    --bs-btn-font-size: .7rem;
    border-radius: 0.3rem;
}

.paginator .btn {
    border-radius: 0.15rem;
    border: none;
}

.paginator .btn.active{
    background-color: #000000;
    color: #ffffff;
}

.no-contents {
    margin-top: 6em;
    margin-bottom: 6em;
}

.bi-chat-heart {
    font-size: 2rem;
    color: #000000;
}
</style>