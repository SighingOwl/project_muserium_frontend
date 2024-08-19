<template>
    <div class="container mt-5" ref="reviewForm">
        <!-- Review Summary -->
        <div class="container d-flex justify-content-between">
            <div>
                <h4>클래스 리뷰</h4>
                <span class="text-black text-opacity-50">클래스를 수강하신 분들이 작성한 리뷰입니다.</span> 
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
                <!-- Class Rating -->
                <div class="col-md-6 mb-3 text-center d-flex flex-column justify-content-center align-items-center" id="class-rating">
                    <label for="rating" class="review-label">클래스가 만족스러웠나요?</label>
                    <div class="star-rating-input" @mouseleave="resetTemporaryRating">
                        <span v-for="star in 5" :key="star" class="star-input" @mouseover="setTemporaryRating(star, 'class')" @click="setRating(star, 'class')" :class="{ filled: star <= (temporaryRating || reviewRating) }">&#9733;</span>
                    </div>
                    <input type="number" id="rating" v-model="reviewRating" min="1" max="5" required hidden/>
                    <label for="rating" class="visual-rating">{{ ratingLabel('class') }}</label>
                </div>

                <!-- Teacher Rating -->
                <div class="col-md-6 mb-3 text-center d-flex flex-column justify-content-center align-items-center" id="teacher-rating">
                    <label for="rating" class="review-label">강사님은 어떠셨나요?</label>
                    <div class="star-rating-input" @mouseleave="resetTemporaryRating">
                        <span v-for="star in 3" :key="star" class="star-input" @mouseover="setTemporaryRating(star, 'teacher')" @click="setRating(star, 'teacher')" :class="{ filled: star <= (temporaryTeacherRating || teacherRating) }">&#9733;</span>
                    </div>
                    <input type="number" id="rating" v-model="teacherRating" min="1" max="3" required hidden/>
                    <label for="rating" class="visual-rating">{{ ratingLabel('teacher') }}</label>
                </div>

                <!-- Class Readiness Rating -->
                <div class="col-md-6 mb-3 text-center d-flex flex-column justify-content-center align-items-center" id="class-readiness-rating">
                    <label for="rating" class="review-label">실습 환경이 잘 준비되었나요?</label>
                    <div class="star-rating-input" @mouseleave="resetTemporaryRating">
                        <span v-for="star in 3" :key="star" class="star-input" @mouseover="setTemporaryRating(star, 'readiness')" @click="setRating(star, 'readiness')" :class="{ filled: star <= (temporaryReadinessRating || readinessRating) }">&#9733;</span>
                    </div>
                    <input type="number" id="rating" v-model="readinessRating" min="1" max="3" required hidden/>
                    <label for="rating" class="visual-rating">{{ ratingLabel('readiness') }}</label>
                </div>
                
                <!-- Class Content Rating -->
                <div class="col-md-6 mb-3 text-center d-flex flex-column justify-content-center align-items-center" id="class-content-rating">
                    <label for="rating" class="review-label">수업 내용이 만족스러웠나요?</label>
                    <div class="star-rating-input" @mouseleave="resetTemporaryRating">
                        <span v-for="star in 3" :key="star" class="star-input" @mouseover="setTemporaryRating(star, 'content')" @click="setRating(star, 'content')" :class="{ filled: star <= (temporaryContentRating || contentRating) }">&#9733;</span>
                    </div>
                    <input type="number" id="rating" v-model="contentRating" min="1" max="3" required hidden/>
                    <label for="rating" class="visual-rating">{{ ratingLabel('content') }}</label>
                </div>
            </div>
            <!-- Review Content -->
            <div class="col-md text-center d-flex flex-column justify-content-center align-items-center position-relative" id="review-container">
                <label class="review-label" for="review-content">{{ reviewLabel}}</label>
                <textarea class="form-control mt-2" id="review-content" v-model="reviewContent" @input="limitTextLength" placeholder="최소 10자 이상 입력해주세요." required></textarea>
                <div class="char-counter">{{ reviewContent.length }} / 500</div>
                <div v-if="textLengthWarning" class="text-warning">{{ textLengthWarning }}</div>
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
                    <div>
                        <span>리뷰 </span>
                        <span class="fw-bold">{{ paginator.count || 0}}</span>
                        <span>건</span>
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
import { h } from 'vue';

export default {
    props: ['classItem'],
    data() {
        return {
            showForm: false,
            showSubmitAlert: false,
            showUpdateAlert: false,
            showDeleteAlert: false,
            page: 1,
            pageSize: 5,
            pageOrder: '',
            currentPageGroup: 0,
            pagesPerGroup: 5,
            reviews: [],
            paginator: [],
            averageRating: 0,
            reviewContent: '',
            maxTextLength: 500,
            textLengthWarning: '',
            reviewRating: 0,
            temporaryRating: 0,
            teacherRating: 0,
            temporaryTeacherRating: 0,
            readinessRating: 0,
            temporaryReadinessRating: 0,
            contentRating: 0,
            temporaryContentRating: 0,
            activeCriteria: 'newest',
            isUpdating: false,
            reviewID: '',
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
            return this.reviewContent.length >= 10 && this.reviewRating > 0 && this.teacherRating > 0 && this.readinessRating > 0 && this.contentRating > 0;
        },
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
        toggleForm() {
            this.showForm = !this.showForm;
        },
        async getReviews() {
            try {
                const response = await axios.get(`https://localhost:8000/common/reviews/read/class/`,{
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
            try {
                const response = await axios.post(`https://localhost:8000/common/reviews/create/class/`, {
                    title: this.reviewTitle,
                    content: this.reviewContent,
                    rating: this.reviewRating,
                    teacher_rating: this.teacherRating,
                    readiness_rating: this.readinessRating,
                    content_rating: this.contentRating,
                }, {
                    params: {
                        glass_class_id: this.classItem.id,
                    },
                    withCredentials: true,
                });
                if (response.status === 200) {
                    await this.getReviews(); // Get reviews again to update the list
                    this.reviewContent = '';
                    this.reviewRating = 0;
                    this.teacherRating = 0;
                    this.readinessRating = 0;
                    this.contentRating = 0;
                    this.showForm = false;  // Hide the form after submitting the review
                    this.showSubmitAlert = true;  // Show the success alert
                } else {
                    throw new Error('Failed to submit review');
                }
            } catch (error) {
                console.error("There was a problem with your get operation.", error);
            }
        },
        getStarStyle(star, rating) {
            const filledPercentage = Math.min(Math.max(rating - (star - 1), 0), 1) * 100;
            return {
                background: `linear-gradient(90deg, #000000 ${filledPercentage}%, #cccccc ${filledPercentage}%)`,
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent'
            };
        },
        updateReview(review) {
            this.reviewID = review.id;
            this.reviewContent = review.content;
            this.reviewRating = review.rating;
            this.teacherRating = review.teacher_rating;
            this.readinessRating = review.readiness_rating;
            this.contentRating = review.content_rating;
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
            try {
                const response = await axios.post(`https://localhost:8000/common/reviews/update/class/`, {
                    title: this.reviewTitle,
                    content: this.reviewContent,
                    rating: this.reviewRating,
                    teacher_rating: this.teacherRating,
                    readiness_rating: this.readinessRating,
                    content_rating: this.contentRating,
                }, {
                    params: {
                        review_id: this.reviewID,
                    },
                    withCredentials: true,
                });
                if (response.status === 200) {
                    await this.getReviews(); // Get reviews again to update the list
                    this.reviewID = '';
                    this.reviewContent = '';
                    this.reviewRating = 0;
                    this.teacherRating = 0;
                    this.readinessRating = 0;
                    this.contentRating = 0;
                    this.showForm = false;  // Hide the form after submitting the review
                    this.isUpdating = false;
                    this.showUpdateAlert = true;  // Show the success alert
                } else {
                    throw new Error('Failed to update review');
                }
            } catch (error) {
                console.error("There was a problem with your get operation.", error);
            }
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
            try {
                const response = await axios.delete(`https://localhost:8000/common/reviews/delete/class`, {
                    params: {
                        review_id: this.reviewID,
                    },
                    withCredentials: true,
                });
                if (response.status === 200) {
                    await this.getReviews(); // Get reviews again to update the list
                    this.reviewID = '';
                    this.showDeleteAlert = true;  // Show the success alert
                } else {
                    throw new Error('Failed to delete review');
                }
            } catch (error) {
                console.error("There was a problem with your get operation.", error);
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
        setRating(rating, label) {
            if (label === 'class') {
                this.reviewRating = rating;
            } else if (label === 'teacher') {
                this.teacherRating = rating;
            } else if (label === 'readiness') {
                this.readinessRating = rating;
            } else if (label === 'content') {
                this.contentRating = rating;
            }
        },
        setTemporaryRating(rating, label) {
            if (label === 'class') {
                this.temporaryRating = rating;
            } else if (label === 'teacher') {
                this.temporaryTeacherRating = rating;
            } else if (label === 'readiness') {
                this.temporaryReadinessRating = rating;
            } else if (label === 'content') {
                this.temporaryContentRating = rating;
            }
        },
        resetTemporaryRating() {
            this.temporaryRating = 0;
            this.temporaryTeacherRating = 0;
            this.temporaryReadinessRating = 0;
            this.temporaryContentRating = 0;
        },
        ratingLabel(label) {
            if (label === 'class') {
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
            } else if (label === 'teacher') {
                if (this.teacherRating === 1) {
                    return this.teacherRating + '점 - 아쉬워요';
                } else if (this.teacherRating === 2) {
                    return this.teacherRating + '점 - 그저그래요';
                } else if (this.teacherRating === 3) {
                    return this.teacherRating + '점 - 괜찮아요';
                } else {
                    return '평점을 선택해주세요.';
                }
            } else if (label === 'readiness') {
                if (this.readinessRating === 1) {
                    return this.readinessRating + '점 - 아쉬워요';
                } else if (this.readinessRating === 2) {
                    return this.readinessRating + '점 - 그저그래요';
                } else if (this.readinessRating === 3) {
                    return this.readinessRating + '점 - 괜찮아요';
                } else {
                    return '평점을 선택해주세요.';
                }
            } else if (label === 'content') {
                if (this.contentRating === 1) {
                    return this.contentRating + '점 - 아쉬워요';
                } else if (this.contentRating === 2) {
                    return this.contentRating + '점 - 그저그래요';
                } else if (this.contentRating === 3) {
                    return this.contentRating + '점 - 괜찮아요';
                } else {
                    return '평점을 선택해주세요.';
                }
            }
        },
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
            this.reviewRating = 0;
            this.teacherRating = 0;
            this.readinessRating = 0;
            this.contentRating = 0;
            this.textLengthWarning = '';
            this.showForm = false;
            this.isUpdating = false;
        },
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
.sort-links {
    color: #888888;
}

.sort-links a {
    font-size: 0.9rem;
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

#rating-tag-card {
    font-size: 0.8rem;
    width: 10rem;
    border-radius: 0.4rem;
}

.high-rating:hover {
    background-color: #82fb82;
    cursor: pointer;
    border: none;
}

.medium-rating:hover {
    background-color: #808080;
    cursor: pointer;
    border: none;
}

.low-rating:hover {
    background-color: #ff3636;
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