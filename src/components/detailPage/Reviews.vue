<template>
    <div class="container mt-5" ref="reviewForm">
        <!-- Review Summary -->
        <div class="container d-flex justify-content-between">
            <div>
                <h4>{{ reviewTitle }}</h4>
                <span class="text-black text-opacity-50">{{ reviewExplaination }}</span> 
            </div>
            <div class="review-rating-summary">
                <h3>{{  averageRating.toFixed(1) }} / 5.0</h3>
                <div class="star-rating">
                    <span v-for="star in 5" :key="star" class="star" :style="getStarStyle(star, averageRating)">&#9733;</span>
                </div>
            </div>
        </div>
        <hr class="border border-dark opacity-100">

        <!-- Review Form Start -->
        <button v-if="!showForm" @click="toggleForm" class="btn btn-dark">리뷰 작성</button>

        <form v-if="showForm" @submit.prevent="submitReview" class="row mt-3">
            <div class="col-md row">
                <!-- Overall Rating : Class Rating or Product Rating -->
                <div class="col-md-6 mb-3 text-center d-flex flex-column justify-content-center align-items-center" id="class-rating">
                    <label for="rating" class="review-label">{{ overallRatingTitle }}</label>
                    <div class="star-rating-input" @mouseleave="resetTemporaryRating">
                        <span v-for="star in 5" :key="star" class="star-input" @mouseover="setTemporaryRating(star, 'overall')" @click="setRating(star, 'overall')" :class="{ filled: star <= (temporaryRating || reviewRating) }">&#9733;</span>
                    </div>
                    <input type="number" id="rating" v-model="reviewRating" min="1" max="5" required hidden/>
                    <label for="rating" class="visual-rating">{{ ratingLabel('overall') }}</label>
                </div>

                <!-- Sub Rating 1 : Teacher Rating or Product Quality Rating -->
                <div class="col-md-6 mb-3 text-center d-flex flex-column justify-content-center align-items-center" id="teacher-rating">
                    <label for="rating" class="review-label">{{ subRatingTitle1 }}</label>
                    <div class="star-rating-input" @mouseleave="resetTemporaryRating">
                        <span v-for="star in 3" :key="star" class="star-input" @mouseover="setTemporaryRating(star, 'sub1')" @click="setRating(star, 'sub1')" :class="{ filled: star <= (temporarySubRating[0] || subRating[0]) }">&#9733;</span>
                    </div>
                    <input type="number" id="rating" v-model="subRating[0]" min="1" max="3" required hidden/>
                    <label for="rating" class="visual-rating">{{ ratingLabel('sub1') }}</label>
                </div>

                <!-- Sub Rating 2 : Class Readiness Rating or Product Design Rating -->
                <div class="col-md-6 mb-3 text-center d-flex flex-column justify-content-center align-items-center" id="class-readiness-rating">
                    <label for="rating" class="review-label">{{ subRatingTitle2 }}</label>
                    <div class="star-rating-input" @mouseleave="resetTemporaryRating">
                        <span v-for="star in 3" :key="star" class="star-input" @mouseover="setTemporaryRating(star, 'sub2')" @click="setRating(star, 'sub2')" :class="{ filled: star <= (temporarySubRating[1] || subRating[1]) }">&#9733;</span>
                    </div>
                    <input type="number" id="rating" v-model="subRating[1]" min="1" max="3" required hidden/>
                    <label for="rating" class="visual-rating">{{ ratingLabel('sub2') }}</label>
                </div>
                
                <!-- Sub Rating 3 : Class Content Rating or Product Price Rating -->
                <div class="col-md-6 mb-3 text-center d-flex flex-column justify-content-center align-items-center" id="class-content-rating">
                    <label for="rating" class="review-label">{{ subRatingTitle3 }}</label>
                    <div class="star-rating-input" @mouseleave="resetTemporaryRating">
                        <span v-for="star in 3" :key="star" class="star-input" @mouseover="setTemporaryRating(star, 'sub3')" @click="setRating(star, 'sub3')" :class="{ filled: star <= (temporarySubRating[2] || subRating[2]) }">&#9733;</span>
                    </div>
                    <input type="number" id="rating" v-model="subRating[2]" min="1" max="3" required hidden/>
                    <label for="rating" class="visual-rating">{{ ratingLabel('sub3') }}</label>
                </div>
            </div>
            <!-- Review Content -->
            <div class="col-md text-center d-flex flex-column justify-content-center align-items-center position-relative" id="review-container">
                <label class="review-label" for="review-content">{{ reviewLabel}}</label>
                <textarea class="form-control mt-2" id="review-content" v-model="reviewContent" @input="limitTextLength" placeholder="최소 10자 이상 입력해주세요." required></textarea>
                <div class="char-counter">{{ reviewContent.length }} / 500</div>
                <div v-if="textLengthWarning" class="text-warning">{{ textLengthWarning }}</div>
            </div>
            <div>
                <input type="file" id="review-image-input" @change="handleImageUpload" hidden/>
                <button type="button" class="btn btn-outline-dark mt-2 review-image-btn d-flex justify-content-center align-items-center" id="upload-image-from-user" @click="triggerFileInput">
                    <div v-if="reviewImagePreview">
                        <img :src="reviewImagePreview" alt="Review Image Preview" class="image-preview"/>
                    </div>
                    <div class="ms-5">
                        <div>
                            <i class="bi bi-image"></i>
                            리뷰 사진 업로드
                        </div>
                        <div class="image-submit-btn-explaination">
                            {{ imageExplanation }}
                        </div>
                    </div>
                </button>
            </div>
            <div class="d-flex justify-content-end" id="submit-btn">
                <button type="button" class="btn btn-outline-dark mt-2 me-2 review-btn" @click="confirmResetForm">취소</button>
                <button v-if="!isUpdating" type="submit" class="btn btn-dark mt-2 review-btn" :disabled="!isReviewVaild" @click="confirmSubmitReview">리뷰 등록</button>
                <button v-if="isUpdating" type="submit" class="btn btn-dark mt-2 review-btn" :disabled="!isReviewVaild" @click="confirmUpdateReview">리뷰 수정</button>
            </div>
        </form>
        <!-- Review Form End -->

        <!-- Reviews List Start -->
        <div class="container mt-4">
            <div class="col-md">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="content-count">
                        <span>Total </span>
                        <span class="fw-bold text-black">{{ reviews.count || 0}}</span>
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
            <div v-if="reviews.count" class="mt-4">
                <div v-for="review in reviews.results" :key="review.id">
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
                            <button v-if="reviewButtonControl(review.author_id, 'update')" type="button" class="btn btn-outline-dark ms-2" id="control-review-btn" @click="updateReview(review)">리뷰 수정</button>
                            <button v-if="reviewButtonControl(review.author_id, 'delete')" type="button" class="btn btn-outline-dark ms-2" id="control-review-btn" @click="confirmDeleteReview(review)">리뷰 삭제</button>
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
                    <button v-if="reviews.previous" @click="handlePrevClick" class="btn btn-outline-dark mx-2">< 이전</button>
                    <button v-for="pageNumber in displayedPages" :key="pageNumber" @click="goToPage(pageNumber)" :class="['btn', 'btn-outline-dark', 'mx-2', { 'active': pageNumber === page }]">
                        {{ pageNumber }}
                    </button>
                    <button v-if="reviews.next" @click="handleNextClick" class="btn btn-outline-dark mx-2">다음 ></button>
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
import { h } from 'vue';

export default {
    props: {
        classItem: Object,
        productItem: Object,
    },
    data() {
        return {
            /* User Permission */
            isAdmin: false,

            /* review basic variables */
            reviewTitle: '',
            reviewExplaination: '',
            overallRatingTitle: '',
            subRatingTitle1: '',
            subRatingTitle2: '',
            subRatingTitle3: '',
            imageExplanation: '',

            /* show variables */
            showForm: false,
            showSubmitAlert: false,
            showUpdateAlert: false,
            showDeleteAlert: false,

            /* pagination variables */
            page: 1,
            pageSize: 5,
            pageOrder: '',
            currentPageGroup: 0,
            pagesPerGroup: 5,

            /* review form variables */
            reviews: [],
            isUpdating: false,
            reviewID: '',
            averageRating: 0,
            reviewContent: '',
            reviewImage: '',
            reviewImagePreview: '',
            maxTextLength: 500,
            textLengthWarning: '',
            reviewRating: 0,
            temporaryRating: 0,
            subRating: [0, 0, 0],
            temporarySubRating: [0, 0, 0],

            /* review sorting variables */
            activeCriteria: 'newest',
            
        }
    },
    watch: {
        showAlert(newVal) {
            if (newVal) {
                alert('리뷰가 성공적으로 등록되었습니다.');
                this.showAlert = false;
            }
        },
        showUpdateAlert(newVal) {
            if (newVal) {
                alert('리뷰가 성공적으로 수정되었습니다.');
                this.showUpdateAlert = false;
            }
        },
        showDeleteAlert(newVal) {
            if (newVal) {
                alert('리뷰가 성공적으로 삭제되었습니다.');
                this.showDeleteAlert = false;
            }
        }
    },
    computed: {
        reviewLabel() {
            if (this.reviewRating === 0) {
                return '평점을 선택해주세요.'
            } else if (this.reviewRating < 3) {
                return '아쉬웠던 점은 무엇이었나요?'
            } else if (this.reviewRating >= 3) {
                return '좋았던 점을 알려주세요!'
            }
        },
        isReviewVaild() {
            return this.reviewContent.length >= 10 && this.reviewRating > 0 && this.subRating[0] > 0 && this.subRating[1] > 0 && this.subRating[2] > 0;
        },
        displayedPages() {
            const start = this.currentPageGroup * this.pagesPerGroup;
            const end = start + Math.min(this.pagesPerGroup, this.reviews.total_pages);

            const page_range = []
            for (let i = start + 1; i < end + 1; i++) {
                page_range.push(i);
            }

            return page_range;
        },
        maxPageGroup() {
            return Math.ceil(this.reviews.total_pages / this.pagesPerGroup) - 1;
        }
    },
    async mounted() {
        await this.isAdimin();
        await this.initReviewPage();
        await this.getReviews();
    },
    methods: {
        /* User Permission Check */
        async isAdimin() {
            await axios
                .get(`${process.env.VUE_APP_API_URL}accounts/auth/is-admin/`, {
                    headers: {
                        'Authorization': localStorage.getItem('accessToken') ? `Bearer ${localStorage.getItem('accessToken')}` : null,
                    },
                    withCredentials: true,
                })
                .then((response) => {
                    this.isAdmin = response.data.is_admin;
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        this.isAdmin = false;
                    }
                });
        },

        toggleForm() {
            const user = this.$store.getters.getUserInfo;
            if (!user) {
                alert('로그인 후 이용해주세요.');
                this.$router.push('/login/');
            }
            this.$nextTick(() => {
                this.$refs.reviewForm.scrollIntoView({ behavior: 'smooth' });
            })
            this.showForm = !this.showForm;
        },

        /* Initialize Review Page */
        async initReviewPage() {
            if (this.classItem) {
                this.reviewTitle = '클래스 리뷰';
                this.reviewExplaination = '클래스를 수강하신 분들이 작성한 리뷰입니다.';
                this.overallRatingTitle = '클래스가 만족스러웠나요?';
                this.subRatingTitle1 = '강사님은 어떠셨나요?';
                this.subRatingTitle2 = '실습 환경이 잘 준비되었나요?';
                this.subRatingTitle3 = '수업 내용이 만족스러웠나요?';
                this.imageExplanation = '클래스 수업 사진이나 수업 결과물 사진을 업로드해주세요!';
            } else if (this.productItem) {
                this.reviewTitle = '제품 리뷰';
                this.reviewExplaination = '제품을 구매하신 분들이 작성한 리뷰입니다.';
                this.overallRatingTitle = '제품이 만족스러웠나요?';
                this.subRatingTitle1 = '제품의 품질은 어땠나요?';
                this.subRatingTitle2 = '제품의 디자인은 적절했나요?';
                this.subRatingTitle3 = '제품의 가격은 어땠나요?';
                this.imageExplanation = '제품 사진을 업로드해주세요!';
            }
        },
        async getReviews() {
            await axios
                .get(`${process.env.VUE_APP_API_URL}common/reviews/read_review/`, {
                    params: {
                        glass_class_id: this.glass_class_id || null,
                        product_id: this.productItem.id || null,
                        page: this.page,
                        page_size: this.pageSize,
                        page_order: this.pageOrder,
                    },
                })
                .then((response) => {
                    if (response.status === 200) {
                        const reviewData = response.data;
                        if (reviewData.reviews.count > 0) {
                            this.reviews = reviewData.reviews;
                            this.averageRating = reviewData.average_rating;
                            console.log(this.reviews);
                        }
                    } 
                })
                .catch(error => {
                    console.error(error.response);
                });

        },
        reviewButtonControl(author, btnType) {
            // 리뷰 수정, 삭제 버튼 표시 여부 결정
            const user = this.$store.getters.getUserInfo;
            if (user) {
                if (user.email === author) {
                    if (btnType === 'update') {
                        return true;
                    } else if (btnType === 'delete') {
                        return true;
                    }
                } else if (this.isAdmin) {
                    if (btnType === 'update') {
                        return false;
                    } else if (btnType === 'delete') {
                        return true;
                    }
                }
            } else {
                return false;
            }
        },

        /* Review CRUD Methods */
        confirmSubmitReview(event) {
            event.preventDefault();

            if (!this.isReviewVaild) {
                return;
            }

            if (confirm('리뷰를 등록하시겠습니까?')) {
                this.submitReview();
            } else {
                return;
            }
        },
        async submitReview() {
            const formData = new FormData();
            formData.append('title', this.reviewTitle);
            formData.append('content', this.reviewContent);
            formData.append('rating', this.reviewRating);
            formData.append('sub_rating_1', this.subRating[0]);
            formData.append('sub_rating_2', this.subRating[1]);
            formData.append('sub_rating_3', this.subRating[2]);

            if (this.reviewImage) {
                formData.append('image', this.reviewImage);
            }

            await axios
                .post(`${process.env.VUE_APP_API_URL}common/reviews/create_review/`, formData, {
                    params: {
                        glass_class_id: this.classItem ? this.classItem.id : null,
                        product_id: this.productItem ? this.productItem.id : null,
                    },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                })
                .then((response) => {
                    if (response.status === 201) {
                        this.getReviews();
                        this.resetForm();
                        this.showForm = false;
                        this.showSubmitAlert = true;
                    }
                })
                .catch((error) => {
                    console.error(error.response);
                });
        },
        updateReview(review) {
            this.reviewID = review.id;
            this.reviewContent = review.content;
            this.reviewImage = review.image;
            this.reviewImagePreview = review.image;
            this.reviewRating = review.rating;
            this.subRating[0] = review.sub_rating_1;
            this.subRating[1] = review.sub_rating_2;
            this.subRating[2] = review.sub_rating_3;
            this.showForm = true;
            this.isUpdating = true;
            this.$nextTick(() => {
                this.$refs.reviewForm.scrollIntoView({ behavior: 'smooth' });
            })
        },
        confirmUpdateReview(event) {
            event.preventDefault();

            if (!this.isReviewVaild) {
                return;
            }

            if (confirm('리뷰를 수정하시겠습니까?')) {
                this.submitUpdatedReview();
            } else {
                return;
            }
        },
        async submitUpdatedReview() {
            const formData = new FormData();
            formData.append('title', this.reviewTitle);
            formData.append('content', this.reviewContent);
            formData.append('rating', this.reviewRating);
            formData.append('sub_rating_1', this.subRating[0]);
            formData.append('sub_rating_2', this.subRating[1]);
            formData.append('sub_rating_3', this.subRating[2]);

            if (this.reviewImage) {
                formData.append('image', this.reviewImage);
            }

            await axios
                .post(`${process.env.VUE_APP_API_URL}common/reviews/update_review/`, formData, {
                    params: {
                        review_id: this.reviewID,
                    },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                })
                .then((response) => {
                    if (response.status === 200) {
                        this.getReviews();
                        this.resetForm();
                        this.showForm = false;
                        this.isUpdating = false;
                        this.showUpdateAlert = true;
                    }
                })
                .catch((error) => {
                    console.error(error.response);
                });
        },
        confirmDeleteReview(review) {
            this.reviewID = review.id;
            if (confirm('리뷰를 삭제하시겠습니까?')) {
                this.deleteReview();
            } else {
                this.reviewID = '';
                return;
            }
        },
        async deleteReview() {
            await axios
                .delete(`${process.env.VUE_APP_API_URL}common/reviews/delete_review/`, {
                    params: {
                        review_id: this.reviewID,
                    },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    withCredentials: true,
                })
                .then((response) => {
                    if (response.status === 200) {
                        this.getReviews();
                        this.reviewID = '';
                        this.showDeleteAlert = true;
                    }
                })
                .catch((error) => {
                    console.error(error.response);
                });
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
            if (this.reviews.next && this.page % this.pagesPerGroup === 0) {
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
            if (this.reviews.next !== null) {
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
        setRating(rating, label) {
            if (label === 'overall') {
                this.reviewRating = rating;
            } else if (label === 'sub1') {
                this.subRating[0] = rating;
            } else if (label === 'sub2') {
                this.subRating[1] = rating;
            } else if (label === 'sub3') {
                this.subRating[2] = rating;
            }
        },
        setTemporaryRating(rating, label) {
            if (label === 'overall') {
                this.temporaryRating = rating;
            } else if (label === 'sub1') {
                this.temporarySubRating[0] = rating;
            } else if (label === 'sub2') {
                this.temporarySubRating[1] = rating;
            } else if (label === 'sub3') {
                this.temporarySubRating[2] = rating;
            }
        },
        resetTemporaryRating() {
            this.temporaryRating = 0;
            this.temporarySubRating = [0, 0, 0];
        },
        ratingLabel(label) {
            if (label === 'overall') {
                if (this.reviewRating === 1) {
                    return this.reviewRating + '점 - 아쉬워요';
                } else if (this.reviewRating === 2) {
                    return this.reviewRating + '점 - 그저그래요';
                } else if (this.reviewRating === 3) {
                    return this.reviewRating + '점 - 괜찮아요';
                } else if (this.reviewRating === 4) {
                    return this.reviewRating + '점 - 좋아요';
                } else if (this.reviewRating === 5) {
                    return this.reviewRating + '점 - 훌륭해요';
                } else {
                    return '평점을 선택해주세요.';
                }
            } else if (label === 'sub1') {
                if (this.subRating[0] > 0) {
                    return this.subRating[0] + '점 - ' + this.subRatingTag1(this.subRating[0]);
                } else {
                    return '평점을 선택해주세요.';
                }
            } else if (label === 'sub2') {
                if (this.subRating[1] > 0) {
                    return this.subRating[1] + '점 - ' + this.subRatingTag2(this.subRating[1]);
                } else {
                    return '평점을 선택해주세요.';
                }
            } else if (label === 'sub3') {
                if (this.subRating[2] > 0) {
                    return this.subRating[2] + '점 - ' + this.subRatingTag3(this.subRating[2]);
                } else {
                    return '평점을 선택해주세요.';
                }
            }
        },
        /* Review Form Content Methods */
        limitTextLength() {
            if (this.reviewContent.length > this.maxTextLength) {
                this.reviewContent = this.reviewContent.slice(0, this.maxTextLength);
                this.textLengthWarning = '최대 500자까지만 입력할 수 있어요!';
            } else {
                this.textLengthWarning = '';
            }
        },
        confirmResetForm() {
            if (confirm('리뷰 작성을 취소하시겠습니까?')) {
                this.resetForm();
            } else{
                return;
            }
        },
        resetForm() {
            this.reviewContent = '';
            this.reviewImage = '';
            this.reviewImagePreview = '';
            this.reviewRating = 0;
            this.subRating = [0, 0, 0];
            this.textLengthWarning = '';
            this.showForm = false;
            this.isUpdating = false;
        },

        /* Image Upload Methods */
        triggerFileInput() {
            const fileInput = document.getElementById('review-image-input');
            fileInput.click();
        },
        handleImageUpload(event) {
            const file = event.target.files[0];
            this.reviewImage = file;

            const reader = new FileReader();
            reader.onload = () => {
                this.reviewImagePreview = reader.result;
            };
            reader.readAsDataURL(file);
        },

        /* review content */
        ratings(review){
            return [ review.sub_rating_1, review.sub_rating_2, review.sub_rating_3 ];
        },
        ratingTag(ratingIndex, rating) {
            // ratingTag for each review content

            if (ratingIndex === 0) {
                return this.subRatingTag1(rating);
            } else if (ratingIndex === 1) {
                return this.subRatingTag2(rating);
            } else if (ratingIndex === 2) {
                return this.subRatingTag3(rating);
            }
        },
        subRatingTag1(rating) {
            // teacher rating or product quality rating

            if (this.classItem) {
                if (rating === 1) {
                    return '강사님이 아쉬워요';
                } else if (rating === 2) {
                    return '강사님이 괜찮아요';
                } else if (rating === 3) {
                    return '강사님이 친절해요';
                }    
            } else if (this.productItem) {
                if (rating === 1) {
                    return '제품 품질이 아쉬워요';
                } else if (rating === 2) {
                    return '제품 품질이 괜찮아요';
                } else if (rating === 3) {
                    return '제품 품질이 훌륭해요';
                }
            }
        },
        subRatingTag2(rating) {
            // class readiness rating or product design rating
            if (this.classItem) {
                if (rating === 1) {
                    return '강의 준비가 미습해요';
                } else if (rating === 2) {
                    return '강의 준비가 나쁘지 않아요';
                } else if (rating === 3) {
                    return '강의 준비가 완벽해요';
                }    
            } else if (this.productItem) {
                if (rating === 1) {
                    return '제품 디자인이 아쉬워요';
                } else if (rating === 2) {
                    return '제품 디자인이 괜찮아요';
                } else if (rating === 3) {
                    return '제품 디자인이 훌륭해요';
                }
            }
        },
        subRatingTag3(rating) {
            // class content rating or product price rating
            if (this.classItem) {
                if (rating === 1) {
                    return '강의 내용이 아쉬워요';
                } else if (rating === 2) {
                    return '강의 내용이 들을만해요';
                } else if (rating === 3) {
                    return '강의 내용이 유익해요';
                }
            } else if (this.productItem) {
                if (rating === 1) {
                    return '제품 가격이 비싸요';
                } else if (rating === 2) {
                    return '제품 가격이 적절해요';
                } else if (rating === 3) {
                    return '제품 가격이 저렴해요';
                }
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

/* review form */
.star-rating-input {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.star-input {
    font-size: 2rem;
    color: #cccccc;
    user-select: none;
}

.star-input.filled {
    color: #000000;
}

.review-label {
    display: block;
    font-size: 1.1rem;
    font-weight: bold;
}

.visual-rating {
    font-size: 0.8rem;
}

.position-relative {
    position: relative;
}

#review-content {
    height: 100%;
    resize: none;
}

.char-counter {
    position: absolute;
    bottom: 10px;
    right: 20px;
    font-size: 0.8rem;
    color: #888888;
}

.review-image-btn {
    width: 100%;
}

.image-preview {
    width: 50px;
    height: 50px;
    object-fit: cover;
}

.image-submit-btn-explaination {
    font-size: 0.9rem;
    color: #888888;
}

.review-btn {
    width: 90px;
}

/* review summary */
.review-rating-summary .star-rating {
    font-size: 1.5rem;
}

.review-rating .star-rating {
    font-size: 1rem;
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