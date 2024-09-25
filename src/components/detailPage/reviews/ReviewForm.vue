<template>
    <div class="container mt-5" ref="reviewForm">
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
                            클래스 수업 사진이나 클래스에서 만든 결과물 사진을 업로드해주세요!
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
    </div>
</template>

<script>
import axios from 'axios';
import { h } from 'vue';

export default {
    props: ['classItem'],
    data() {
        return {
            /* show variables */
            showForm: false,
            showSubmitAlert: false,
            showUpdateAlert: false,
            showDeleteAlert: false,

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
            teacherRating: 0,
            temporaryTeacherRating: 0,
            readinessRating: 0,
            temporaryReadinessRating: 0,
            contentRating: 0,
            temporaryContentRating: 0,
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
    },
    methods: {
        toggleForm() {
            this.showForm = !this.showForm;
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
                const formData = new FormData();
                formData.append('title', this.reviewTitle);
                formData.append('content', this.reviewContent);
                formData.append('rating', this.reviewRating);
                formData.append('teacher_rating', this.teacherRating);
                formData.append('readiness_rating', this.readinessRating);
                formData.append('content_rating', this.contentRating);

                if (this.reviewImage) {
                    formData.append('image', this.reviewImage);
                }
                
                const response = await axios.post(`${process.env.VUE_APP_API_URL}common/reviews/create/class/`, formData, {
                    params: {
                        glass_class_id: this.classItem.id,
                    },
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.status === 200) {
                    await this.getReviews(); // Get reviews again to update the list
                    this.reviewContent = '';
                    this.reviewImage = '';
                    this.reviewImagePreview = '';
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
        updateReview(review) {
            this.reviewID = review.id;
            this.reviewContent = review.content;
            this.reviewImage = review.image;
            this.reviewImagePreview = review.image;
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
                const formData = new FormData();
                formData.append('title', this.reviewTitle);
                formData.append('content', this.reviewContent);
                formData.append('rating', this.reviewRating);
                formData.append('teacher_rating', this.teacherRating);
                formData.append('readiness_rating', this.readinessRating);
                formData.append('content_rating', this.contentRating);

                if (this.reviewImage) {
                    formData.append('image', this.reviewImage);
                }

                const response = await axios.post(`${process.env.VUE_APP_API_URL}common/reviews/update/class/`, formData, {
                    params: {
                        review_id: this.reviewID,
                    },
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.status === 200) {
                    await this.getReviews(); // Get reviews again to update the list
                    this.reviewID = '';
                    this.reviewContent = '';
                    this.reviewImage = '';
                    this.reviewImagePreview = '';
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
                const response = await axios.delete(`${process.env.VUE_APP_API_URL}common/reviews/delete/class/`, {
                    params: {
                        user_id : 1,
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
            this.teacherRating = 0;
            this.readinessRating = 0;
            this.contentRating = 0;
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
</style>