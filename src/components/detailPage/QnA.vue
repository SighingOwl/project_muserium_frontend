<template>
    <div class="container mt-5" ref="questionForm">
        <!-- Question Summary -->
        <div class="container d-flex justify-content-between">
            <div>
                <h4>{{ qnaTitle }}</h4>
                <span class="text-black text-opacity-50">{{ qnaExplanation }}</span> 
            </div>
        </div>
        <hr class="border border-dark opacity-100">

        <!-- Question Form Start -->
        <button v-if="!showQuestionForm" @click="toggleQuestionForm" class="btn btn-dark">문의 작성</button>

        <form v-if="showQuestionForm" @submit.prevent="submitQuestion" class="row mt-3">
            <!-- Question Content -->
            <div class="col-md text-center d-flex flex-column justify-content-center align-items-center position-relative" id="question-container">
                <label class="question-label mb-3" for="question-content"><h5>{{ questionExplanation }}</h5></label>
                <div class="col-12 d-flex justify-content-start align-items-center mb-2">
                    <div class="form-floating col-md-6">
                        <textarea class="form-control mt-2" id="question-title" v-model="questionTitle" @input="limitQuestionTitleLength" placeholder="제목을 적어주세요. (최소 5자 / 최대 100자)" required></textarea>
                        <label for="question-title">제목을 적어주세요. (최소 5자 / 최대 100자)</label>
                    </div>
                    <div class="form-check form-switch ms-3">
                        <input class="form-check-input custom-switch" type="checkbox" role="switch" id="is-secret-selector" v-model="isSecret">
                        <label class="form-check-label" for="is-secret-selector">
                            <i :class="isSecret ? 'bi bi-lock-fill' : 'bi bi-unlock'"></i>
                            비밀글 설정
                        </label>
                    </div>
                </div>
                <div class="form-floating col-12 mb-3">
                    <textarea class="form-control mt-2" id="question-content" v-model="questionContent" @input="limitQuestionTextLength" placeholder="최소 10자 이상 입력해주세요." required></textarea>
                    <label for="question-content">문의 내용을 입력해주세요. (최소 10자 / 최대 500자)</label>
                    <div class="char-counter">{{ questionContent.length }} / {{ questionContentLenUpperBound }}</div>
                    <div v-if="textLengthWarning" class="text-warning">{{ textLengthWarning }}</div>
                </div>
            </div>
            <div>
                <input type="file" id="question-image-input" @change="handleQuestionImageUpload" hidden/>
                <button type="button" class="btn btn-outline-dark mt-2 image-btn d-flex justify-content-center align-items-center" id="upload-question-image-from-user" @click="triggerQuestionFileInput">
                    <div v-if="questionImagePreview">
                        <img :src="questionImagePreview" alt="Question Image Preview" class="image-preview"/>
                    </div>
                    <div class="ms-5">
                        <div>
                            <i class="bi bi-image"></i>
                            질문 사진 업로드
                        </div>
                        <div class="image-submit-btn-explaination">
                            문의에 필요한 사진을 업로드해주세요.
                        </div>
                    </div>
                </button>
            </div>
            <div class="d-flex justify-content-end" id="submit-btn">
                <button type="button" class="btn btn-outline-dark mt-2 me-2 question-btn" @click="confirmResetQuestionForm">취소</button>
                <button v-if="!isUpdating" type="submit" class="btn btn-dark mt-2 question-btn" :disabled="!isQuestionVaild" @click="confirmSubmitQuestion">문의 등록</button>
                <button v-if="isUpdating" type="submit" class="btn btn-dark mt-2 question-btn" :disabled="!isQuestionVaild" @click="confirmUpdateQuestion">문의 수정</button>
            </div>
        </form>
        <!-- Question Form End -->
        
        <!-- Question List Start-->
        <div class="container mt-4">
            <div class="col-md">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="content-count">
                        <span>Total </span>
                        <span class="fw-bold text-black">{{ questions.count || 0}}</span>
                        <span> Questions</span>
                    </div>
                    <div class="sort-links">
                        <a href="#" @click.prevent="sortQuestions('newest')" class="text-decoration-none me-2" :class="{ 'active': activeCriteria === 'newest' }">최신순</a>|
                        <a href="#" @click.prevent="sortQuestions('viewHigh')" class="text-decoration-none me-2" :class="{ 'active': activeCriteria === 'viewHigh' }">조회순</a>
                    </div>
                </div>
            </div>
            <hr>
            <!-- Question List Header-->
            <div v-if="questions" class="mt-4">
                <div class="row fw-bold">
                    <div class="col text-center">답변여부</div>
                    <div class="col-6 text-center">제목</div>
                    <div class="col text-center">작성자</div>
                    <div class="col text-center">작성일</div>
                    <div class="col text-center">답변일</div>
                    <div class="col text-center">조회수</div>
                </div>
                <hr>
                <!-- Question List Content -->
                <div v-for="(question, index) in questions.results" :key="question.id" >
                    <div class="row align-items-center mt-4">
                        <div class="col text-center">{{ !question.is_answered ? '답변대기' : '답변완료' }}</div>
                        <div class="col-6">
                            <template v-if="!question.is_secret">
                                <a href="#" class="text-decoration-none text-black question-title" @click="handleTitleClick(question, $event)">
                                    {{ question.title }}
                                </a>
                            </template>
                            <template v-else>
                                <a class="text-decoration-none text-black question-title text-opacity-50" @click="handleTitleClick(question, $event)">
                                    {{ question.title }}
                                </a>
                                <i v-if="question.is_secret" class="bi bi-lock-fill"></i>    
                            </template>
                        </div>
                        <div class="col text-center">{{ question.author }}</div>
                        <div class="col text-center">{{ formatDate(question.created_at) }}</div>
                        <div class="col text-center">{{ formatDate(question.answered_at) }}</div>
                        <div class="col text-center">{{ question.view_count }}</div>    
                    </div>
                    <div v-if="showContent === question.id" class="mt-2 question-content-area">
                        <!-- Question Content -->
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-md-10 offset-md-1 qna-content-area">
                                    <div class="d-flex justify-content-between align-items-end">
                                        <div class="fw-bold">질문 내용</div>
                                        <div>
                                            <!-- 문의 수정은 작성자만 가능하고 문의 삭제는 작성자와 관리자 모두 가능하도록 수정 예정 -->
                                            <button v-if="showAuthorModify" type="button" class="btn btn-outline-dark ms-2" id="control-review-btn" @click="updateQuestionForm(question)">문의 수정</button>
                                            <button v-if="showAuthorDelete" type="button" class="btn btn-outline-dark ms-2" id="control-review-btn" @click="confirmDeleteQuestion(question)">문의 삭제</button>     
                                        </div>
                                    </div> 
                                    <div class="mt-3">
                                        <p>{{ questionContents[question.id].content }}</p>
                                        <img v-if="questionContents[question.id].image" :src="questionContents[question.id].image" alt="Question Image" class="img-fluid mt-3 content-img"/>
                                    </div>
                                    
                                </div>
                            </div>
                            <!-- Answer Content -->
                            <hr v-if="question.is_answered" class="col-md-10 offset-md-1">
                            <div class="row">
                                <div class="col-md-10 offset-md-1 qna-content-area">
                                    <div class="d-flex justify-content-between align-items-end">
                                        <div v-if="question.is_answered" class="fw-bold">관리자 답변</div>
                                        <div v-if="!question.is_answered"></div>
                                        <div v-if="showAdminMenu">
                                            <button v-if="!question.is_answered" type="button" class="btn btn-outline-dark ms-2" id="control-review-btn" @click="toggleAnswerForm(question.id)" >관리자 답변 등록</button>
                                            <button v-if="question.is_answered" type="button" class="btn btn-outline-dark ms-2" id="control-review-btn" @click="updateAnswerForm(question)">관리자 답변 수정</button>
                                            <button v-if="question.is_answered" type="button" class="btn btn-outline-dark ms-2" id="control-review-btn" @click="confirmDeleteAnswer(question.id, answerContents[question.id].id)">관리자 답변 삭제</button>  
                                        </div>
                                    </div>  
                                    <div v-if="question.is_answered" class="mt-3">
                                        <p>{{ answerContents[question.id].content }}</p>
                                        <img v-if="answerContents[question.id].image" :src="answerContents[question.id].image" alt="Answer Image" class="img-fluid mt-3 content-img"/>
                                    </div>
                                </div>
                            </div>
                            <!-- Answer Form Start -->
                            <form v-if="showAnswerForm === question.id && showAdminMenu" @submit.prevent="submitAnswer(question)" class="mt-3">
                                <div class="row">
                                    <div class="col-md-10 offset-md-1">
                                        <div class="form-floating mb-3">
                                            <textarea class="form-control" id="answer-content" v-model="answerContent" @input="limitAnswerTextLength" placeholder="최소 10자 이상 입력해주세요." required></textarea>
                                            <label for="answer-content">답변 내용을 입력해주세요. (최소 10자 / 최대 500자)</label>
                                            <div class="char-counter">{{ answerContent.length }} / {{ answerContentLenUpperBound }}</div>
                                            <div v-if="textLengthWarning" class="text-warning">{{ textLengthWarning }}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-10 offset-md-1">
                                        <input type="file" id="answer-image-input" @change="handleAnswerImageUpload" hidden/>
                                        <button type="button" class="btn btn-outline-dark mt-2 image-btn d-flex justify-content-center align-items-center" id="upload-answer-image-from-user" @click="triggerAnswerFileInput">
                                            <div v-if="answerImagePreview">
                                                <img :src="answerImagePreview" alt="Answer Image Preview" class="image-preview"/>
                                            </div>
                                            <div class="ms-5">
                                                <div>
                                                    <i class="bi bi-image"></i>
                                                    답변 사진 업로드
                                                </div>
                                                <div class="image-submit-btn-explaination">
                                                    답변에 필요한 사진을 업로드해주세요.
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end" id="submit-btn">
                                    <button type="button" class="btn btn-outline-dark mt-2 me-2 answer-btn" @click="confirmResetAnswerForm">취소</button>
                                    <button v-if="!isUpdating" type="submit" class="btn btn-dark mt-2 answer-btn" :disabled="!isAnswerVaild" @click="confirmSubmitAnswer(question.id, $event)">답변 등록</button>
                                    <button v-if="isUpdating" type="submit" class="btn btn-dark mt-2 answer-btn" :disabled="!isAnswerVaild" @click="confirmUpdateAnswer">답변 수정</button>
                                </div>    
                            </form>
                            <!-- Answer Form End -->
                        </div>
                    </div>
                    <hr>                 
                </div>

                <!-- Paginator Start -->
                <div class="paginator d-flex justify-content-center align-items-center" ref="paging">
                    <button v-if="questions.previous" @click="handlePrevClick" class="btn btn-outline-dark mx-2">< 이전</button>
                    <button v-for="pageNumber in displayedPages" :key="pageNumber" @click="goToPage(pageNumber)" :class="['btn', 'btn-outline-dark', 'mx-2', { 'active': pageNumber === page }]">
                        {{ pageNumber }}
                    </button>
                    <button v-if="questions.next" @click="handleNextClick" class="btn btn-outline-dark mx-2">다음 ></button>
                </div>
                <!-- Paginator End -->
            </div>
            <div v-else>
                <div class="text-center no-contents">
                    <span>
                        <i class="bi bi-chat-heart"></i>
                    </span>
                    <p>문의를 기다리고 있어요!</p>
                </div>
            </div>
        </div>
        <!-- Question List End-->
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: {
        classItem: Object,
        productItem: Object,
    },
    data() {
        return {
            /* QnA page variables */
            qnaTitle: '',
            qnaExplanation: '',
            questionExplanation: '',
            showAdminMenu: false,   // 관리자 답변 버튼 활성화 여부
            showAuthorModify: false,    // 작성자 수정 버튼 활성화 여부
            showAuthorDelete: false,    // 작성자 삭제 버튼 활성화 여부

            /* showAlert variables */
            showSubmitAlert: false,
            showUpdateAlert: false,
            showDeleteAlert: false,
            showQuestionForm: false,
            showAnswerForm: false,
            showContent: false,

            /* Question variables */
            questionTitle: '',
            questionTitleLenLowerBound: 5,
            questionTitleLenUpperBound: 100,
            questions: {},
            questionID: '',
            questionContents: {},
            questionContent: '',
            questionImage: '',
            questionImagePreview: '',
            questionContentLenLowerBound: 10,
            questionContentLenUpperBound: 500,

            /* Answer variables */
            answerID: '',
            answerContents: {},
            answerContent: '',
            answerImage: '',
            answerImagePreview: '',
            answerContentLenLowerBound: 10,
            answerContentLenUpperBound: 500,

            /* Form variables */
            textLengthWarning: '',
            isSecret: false,
            isUpdating: false,

            /* Paginator variables */
            page: 1,
            pagesize: 5,
            pageOrder: '-created_at',
            pagesPerGroup: 5,
            currentPageGroup: 0,
            activeCriteria: 'newest',
        };
    },
    watch: {
        showSubmitAlert(newVal) {
            if (newVal) {
                alert('문의가 성공적으로 등록되었습니다.');
                this.showSubmitAlert = false;
            }
        },
        showUpdateAlert(newVal) {
            if (newVal) {
                alert('문의가 성공적으로 수정되었습니다.');
                this.showUpdateAlert = false;
            }
        },
        showDeleteAlert(newVal) {
            if (newVal) {
                alert('문의가 성공적으로 삭제되었습니다.');
                this.showDeleteAlert = false;
            }
        }
    },
    computed: {
        isQuestionVaild() {
            return this.questionContent.length >= this.questionContentLenLowerBound && this.questionContent.length <= this.questionContentLenUpperBound && this.questionTitle.length >= this.questionTitleLenLowerBound && this.questionTitle.length <= this.questionTitleLenUpperBound;
        },
        isAnswerVaild() {
            return this.answerContent.length >= this.answerContentLenLowerBound && this.answerContent.length <= this.answerContentLenUpperBound;
        },
        displayedPages() {
            const start = this.currentPageGroup * this.pagesPerGroup;
            const end = start + Math.min(this.pagesPerGroup, this.questions.total_pages);

            const page_range = []
            for (let i = start + 1; i < end + 1; i++) {
                page_range.push(i);
            }

            return page_range;
        },
        maxPageGroup() {
            return Math.ceil(this.questions.total_pages / this.pagesPerGroup) - 1;
        }
    },
    async mounted() {
        await this.initQnAPage();
        await this.getQuestionList();
    },
    methods: {
        /* Initialization QnA Page */
        async initQnAPage() {
            if (this.classItem) {
                this.qnaTitle = '클래스 문의';
                this.qnaExplanation = '클래스에 대한 궁금한 점을 문의해주세요!';
                this.questionExplanation = '클래스에 대해서 어떤 점이 궁금하세요?';
            } else if (this.productItem) {
                this.qnaTitle = '상품 문의';
                this.qnaExplanation = '상품에 대한 궁금한 점을 문의해주세요!';
                this.questionExplanation = '상품에 대해서 어떤 점이 궁금하세요?';
            }
        },

        /* Question Methods */
        async getQuestionList() {
            await axios
                .get(`${process.env.VUE_APP_API_URL}common/questions/read_question/`, {
                    params: {
                        glass_class_id: this.classItem ? this.classItem.id : null,
                        product_id: this.productItem.id ? this.productItem.id : null,
                        page: this.page,
                        page_size: this.pageSize,
                        page_order: this.pageOrder,
                    }
                })
                .then((response) => {
                    if (response.status === 200) {
                        const questionData = response.data;
                        this.questions = questionData.questions;
                    }
                })
                .catch((error) => {
                    console.error(error.response);
                });
        },
        async getQuestionContent(questionID) {
            await axios
                .get(`${process.env.VUE_APP_API_URL}common/questions/get_question_content/`, {
                    params: {
                        question_id: questionID,
                    },
                    withCredentials: true,
                })
                .then((response) => {
                    if (response.status === 200) {
                        const contentData = response.data;
                        this.questionContents[questionID] = contentData.question;
                        this.answerContents[questionID] = contentData.answer;
                    }
                })
                .catch((error) => {
                    console.error(error.response);
                });
        }, 
        confirmSubmitQuestion(event) {
            event.preventDefault();

            if (!this.isQuestionVaild) {
                alert('질문 내용 확인해주세요.');
            }

            if (confirm('문의를 등록하시겠습니까?')) {
                this.submitQuestion();
            } else {
                return;
            }
        },
        async submitQuestion() {
            const formData = new FormData();
            formData.append('title', this.questionTitle);
            formData.append('content', this.questionContent);
            formData.append('is_secret', this.isSecret);

            if (this.questionImage) {
                formData.append('image', this.questionImage);
            }

            await axios
                .post(`${process.env.VUE_APP_API_URL}common/questions/create_question/`, formData, {
                    params: {
                        class_id : this.classItem ? this.classItem.id : null,
                        product_id: this.productItem ? this.productItem.id : null,
                    },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                })
                .then(async (response) => {
                    if (response.status === 201) {
                        await this.getQuestionList();
                        await this.resetQuestionForm();
                        this.showSubmitAlert = true;
                    }
                })
                .catch((error) => {
                    console.error(error.response);
                });
        },
        updateQuestionForm(question) {
            this.questionID = question.id;
            this.questionTitle = question.title;
            this.questionContent = this.questionContents[question.id].content;
            this.questionImagePreview = this.questionContents[question.id].image;
            this.isSecret = question.is_secret;
            this.isUpdating = true;
            this.showQuestionForm = true;
            this.$nextTick(() => {
                this.$refs.questionForm.scrollIntoView({ behavior: 'smooth' });
            });
        },
        confirmUpdateQuestion(event) {
            event.preventDefault();

            if (!this.isQuestionVaild) {
                alert('질문 내용 확인해주세요.');
            }

            if (confirm('문의를 수정하시겠습니까?')) {
                this.updateQuestion();
            } else {
                return;
            }
        },
        async updateQuestion() {
            const formData = new FormData();
            formData.append('title', this.questionTitle);
            formData.append('content', this.questionContent);
            formData.append('is_secret', this.isSecret);

            if (this.questionImage) {
                formData.append('image', this.questionImage);
            }

            await axios
                .post(`${process.env.VUE_APP_API_URL}common/questions/update_question/`, formData, {
                    params: {
                        question_id: this.questionID,
                    },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                })
                .then(async (response) => {
                    if (response.status === 200) {
                        await this.getQuestionList();
                        await this.getQuestionContent(this.questionID);
                        await this.resetQuestionForm();
                        this.showUpdateAlert = true;
                    }
                })
                .catch((error) => {
                    console.error(error.response);
                });
        },
        confirmDeleteQuestion(question) {
            if (!question) {
                alert('질문을 확인해주시고 다시 시도해주세요.');
            }

            this.questionID = question.id;
            if (confirm('문의를 삭제하시겠습니까?')) {
                this.deleteQuestion();
            } else {
                return;
            }
        },
        async deleteQuestion() {
            await axios
                .delete(`${process.env.VUE_APP_API_URL}common/questions/delete_question/`, {
                    params: {
                        question_id: this.questionID,
                    },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    withCredentials: true,
                })
                .then(async (response) => {
                    if (response.status === 200) {
                        this.questionContents[this.questionID] = '';
                        this.answerContents[this.questionID] = '';

                        await this.getQuestionList();
                        this.showDeleteAlert = true;
                    }
                })
                .catch((error) => {
                    console.error(error.response);
                });
        },
        

        /* Answer Methods */
        confirmSubmitAnswer(questionID, event) {
            event.preventDefault();

            if (!this.isAnswerVaild) {
                alert('답변 내용 확인해주세요.');
            }

            if (confirm('답변을 등록하시겠습니까?')) {
                this.submitAnswer(questionID);
            } else {
                return;
            }
        },
        async submitAnswer(questionID) {
            const formData = new FormData();
            formData.append('content', this.answerContent);

            if (this.answerImage) {
                formData.append('image', this.answerImage);
            }
            
            await axios
                .post(`${process.env.VUE_APP_API_URL}common/answers/create_answer/`, formData, {
                    params: {
                        question_id: questionID,
                    },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                })
                .then(async (response) => {
                    if (response.status === 201) {
                        await this.getQuestionList();
                        await this.getQuestionContent(questionID);
                        await this.resetAnswerForm();
                        this.showSubmitAlert = true;
                    }
                })
                .catch((error) => {
                    console.error(error.response);
                });
        },
        updateAnswerForm(question) {
            this.questionID = question.id;
            this.answerID = this.answerContents[question.id].id;
            this.answerContent = this.answerContents[question.id].content;
            this.answerImage = this.answerContents[question.id].image;
            this.answerImagePreview = this.answerContents[question.id].image;
            this.isUpdating = true;
            this.showAnswerForm = question.id;
        },
        confirmUpdateAnswer(event) {
            event.preventDefault();

            if (!this.isAnswerVaild) {
                alert('답변 내용 확인해주세요.');
            }

            if (confirm('답변을 수정하시겠습니까?')) {
                this.updateAnswer();
            } else {
                return;
            }
        },
        async updateAnswer() {
            const formData = new FormData();
            formData.append('content', this.answerContent);

            if (this.answerImage) {
                formData.append('image', this.answerImage);
            }

            await axios
                .post(`${process.env.VUE_APP_API_URL}common/answers/update_answer/`, formData, {
                    params: {
                        answer_id: this.answerID,
                    },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                })
                .then(async (response) => {
                    if (response.status === 200) {
                        await this.getQuestionList();
                        await this.getQuestionContent(this.questionID);
                        await this.resetAnswerForm();
                        this.showUpdateAlert = true;
                    }
                })
                .catch((error) => {
                    console.error(error.response);
                });
        },
        confirmDeleteAnswer(questionID, answerID) {
            if (!answerID) {
                alert('답변 ID를 확인해주시고 다시 시도해주세요.');
            }

            if (confirm('답변을 삭제하시겠습니까?')) {
                this.deleteAnswer(questionID, answerID);
            } else {
                return;
            }
        },
        async deleteAnswer(questionID, answerID) {
            await axios
                .delete(`${process.env.VUE_APP_API_URL}common/answers/delete_answer/`, {
                    params: {
                        answer_id: answerID,
                    },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    withCredentials: true,
                })
                .then(async (response) => {
                    if (response.status === 200) {
                        this.answerContents[questionID] = '';

                        await this.getQuestionList();
                        await this.getQuestionContent(questionID);
                        this.showDeleteAlert = true;
                    }
                })
                .catch((error) => {
                    console.error(error.response);
                });
        },

        /* Content Methods */
        async handleTitleClick(question, event) {
            /* 
            게시물 제목을 클릭하면 해당 게시물의 내용을 보여주고 조회수를 증가시킴
            작성자 확인 절차를 통해 비밀글인 경우 작성자와 관리자만 확인 가능
            작성자인 경우 수정, 삭제 버튼 활성화
            */

            event.preventDefault();
            const questionID = question.id;

            // 작성자 확인 - 로그인 상태일 때만 적용
            if (this.$store.getters.getIsLogin !== false) {
                const authorStatus = await this.isAuthor(questionID);
                if (authorStatus === true) {
                    this.showAdminMenu = false;
                    this.showAuthorModify = true;
                    this.showAuthorDelete = true;
                } else if (authorStatus === 'Super') {
                    this.showAdminMenu = true;
                    this.showAuthorModify = false;
                    this.showAuthorDelete = true;
                } else {
                    this.showAdminMenu = false;
                    this.showAuthorModify = false;
                    this.showAuthorDelete = false;
                    if (question.is_secret) {
                        alert('비밀글은 작성자만 확인 가능합니다.');
                        return;
                    }
                }
            } else {
                this.showAdminMenu = false;
                this.showAuthorModify = false;
                this.showAuthorDelete = false;
                if (question.is_secret) {
                    alert('비밀글은 작성자만 확인 가능합니다.');
                    return;
                }
            }

            // Content가 보이는 상태라면 조회수를 증가시키지 않음
            if (this.showContent !== questionID) {
                if (this.answerContent.length > 0) {
                    this.confirmResetAnswerForm();
                }

                await this.getQuestionContent(questionID);
                await this.increaseViewCount(question);
                this.showContent = questionID;
            } else {
                if (this.answerContent.length > 0) {
                    this.confirmResetAnswerForm();
                } 

                this.showAnswerForm = false;
                this.showContent = false;
            }
        },
        async isAuthor(questionID) {
            // 작성자 확인 절차
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_URL}common/questions/is_author/`, {
                    params: {
                        question_id: questionID,
                    },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    withCredentials: true,
                });
        
                if (response.status === 200) {
                    const data = response.data;
                    return data.is_author;
                }
            } catch (error) {
                console.error(error.response);
                return false;
            }
            
        },
        async increaseViewCount(question) {
            await axios
                .post(`${process.env.VUE_APP_API_URL}common/questions/increase_question_view_count/`, {}, {
                    params: {
                        question_id: question.id,
                    },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    withCredentials: true,
                })
                .then((response) => {
                    if (response.status === 200) {
                        const data = response.data;
                        question.view_count = data.view_count;
                    }
                })
                .catch((error) => {
                    console.error(error.response);
                });
        },

        /* Form Methods */
        toggleQuestionForm() {
            this.showQuestionForm = !this.showQuestionForm;
        },
        toggleAnswerForm(questionID) {
            this.showAnswerForm = questionID;
        },
        limitQuestionTitleLength() {
            if (this.questionTitle.length > this.questionTitleLenUpperBound) {
                this.questionTitle = this.questionTitle.slice(0, this.questionTitleLenUpperBound);
            }
        },
        limitQuestionTextLength() {
            if (this.questionContent.length > this.questionContentLenUpperBound) {
                this.questionContent = this.questionContent.slice(0, this.questionContentLenUpperBound);
            }
        },
        confirmResetQuestionForm() {
            if (confirm('작성 중인 질문을 모두 지우시겠습니까?')) {
                this.resetQuestionForm();
            }
        },
        confirmResetAnswerForm() {
            if (confirm('작성 중인 답변을 모두 지우시겠습니까?')) {
                this.resetAnswerForm();
            }
        },
        async resetQuestionForm() {
            this.questionID = '';
            this.questionTitle = '';
            this.questionContent = '';
            this.questionImage = '';
            this.questionImagePreview = '';
            this.isSecret = false;
            this.isUpdating = false;
            this.showQuestionForm = false;
        },
        async resetAnswerForm() {
            this.answerID = '';
            this.answerContent = '';
            this.answerImage = '';
            this.answerImagePreview = '';
            this.isUpdating = false;
            this.showAnswerForm = false;
        },

        /* Image Upload Methods */
        triggerQuestionFileInput() {
            const fileInput = document.getElementById('question-image-input');
            fileInput.click();
        },
        handleQuestionImageUpload(event) {
            const file = event.target.files[0];
            this.questionImage = file;

            const reader = new FileReader();
            reader.onload = () => {
                this.questionImagePreview = reader.result;
            };
            reader.readAsDataURL(file);
        },
        triggerAnswerFileInput() {
            const fileInput = document.getElementById('answer-image-input');
            fileInput.click();
        },
        handleAnswerImageUpload(event) {
            const file = event.target.files[0];
            this.answerImage = file;

            const reader = new FileReader();
            reader.onload = () => {
                this.answerImagePreview = reader.result;
            };
            reader.readAsDataURL(file);
        },

        /* Paginator Methods */
        sortQuestions(criteria) {
            this.activeCriteria = criteria;
            this.page = 1;
            if (criteria === 'newest') {
                this.pageOrder = '-created_at'; 
                this.getQuestionList();
            } else if (criteria === 'viewHigh') {
                this.pageOrder = '-view_count';
                this.getQuestionList();
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
            await this.getQuestionList();
            this.scrollToPaginator();
        },
        async prevPage() {
            if (this.page > 1) {
                this.page--;
                await this.getQuestionList();
            }
        },
        async nextPage() {
            if (this.paginator.next_page !== 'None') {
                this.page++;
                await this.getQuestionList();
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
            if (!dateString) {
                return '-';
            }
            const options = { year: 'numeric', month: '2-digit', day: '2-digit'};
            const date = new Date(dateString);
            return date.toLocaleDateString('ko-KR', options).replace(/\s/g, '');
        },
    },
}
</script>

<style scoped>
.question-rating-summary {
    display: flex;
    flex-direction: column;
    align-items: start;
}

/* question form */
.question-label {
    display: block;
    font-size: 1.1rem;
    font-weight: bold;
}

.position-relative {
    position: relative;
}

#question-title {
    width: 100%;
    resize: none;
}

.custom-switch {
    background-color: #FFFFFF;
    border-color: #808080;
}

.custom-switch:checked {
    background-color: #000000;
    border-color: #000000;
}

.custom-switch:focus {
    color: #808080;
    box-shadow: #808080 !important;
}

#question-content {
    height: 100%;
    resize: none;
}

.char-counter {
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 0.8rem;
    color: #888888;
}

.image-btn {
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

.question-btn {
    width: 90px;
}

/* Question content */
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

.question-title:hover {
    opacity: 0.5;
    cursor: pointer;
}

.question-info {
    font-size: 0.75rem;
    opacity: 0.8;
}

.question-content-area {
    background-color: #ffffff;
    border-radius: 0.5rem;
    padding: 1rem;
}

.qna-content-area {
    background-color: #ffffff;
    border-radius: 0.5rem;
    padding: 1rem;
}

.content-img {
    border-radius: 0.3rem;
    max-width: 25%;
    min-width: 25%;
}

#control-question-btn {
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

/* Answer Form */
#answer-content {
    height: 100%;
    resize: none;
}

.answer-btn {
    width: 90px;
}
</style>