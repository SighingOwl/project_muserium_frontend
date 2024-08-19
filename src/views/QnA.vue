<template>
    <div class="container mt-5" ref="questionForm">
        <!-- Question Summary -->
        <div class="container d-flex justify-content-between">
            <div>
                <h4>고객 문의</h4>
                <span class="text-black text-opacity-50">클래스에 대해 궁금한 점을 물어보세요!</span> 
            </div>
        </div>
        <hr class="border border-dark opacity-100">

        <!-- Question Form Start -->
        <button v-if="!showQuestionForm" @click="toggleQuestionForm" class="btn btn-dark">문의 작성</button>

        <form v-if="showQuestionForm" @submit.prevent="submitQuestion" class="row mt-3">
            <!-- Question Content -->
            <div class="col-md text-center d-flex flex-column justify-content-center align-items-center position-relative" id="question-container">
                <label class="question-label mb-3" for="question-content"><h5>클래스에 대해서 어떤 점이 궁금하세요?</h5></label>
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
                    <div>
                        <span>문의 </span>
                        <span class="fw-bold">{{ paginator.count || 0}}</span>
                        <span>건</span>
                    </div>
                    <div class="sort-links">
                        <a href="#" @click.prevent="sortQuestions('newest')" class="text-decoration-none me-2" :class="{ 'active': activeCriteria === 'newest' }">최신순</a>|
                        <a href="#" @click.prevent="sortQuestions('viewHigh')" class="text-decoration-none me-2" :class="{ 'active': activeCriteria === 'viewHigh' }">조회순</a>
                    </div>
                </div>
            </div>
            <hr>
            <div v-if="questionList.length" class="mt-4">
                <div class="row fw-bold">
                    <div class="col text-center">답변여부</div>
                    <div class="col-6 text-center">제목</div>
                    <div class="col text-center">작성자</div>
                    <div class="col text-center">작성일</div>
                    <div class="col text-center">답변일</div>
                    <div class="col text-center">조회수</div>
                </div>
                <hr>
                <div v-for="(question, index) in questionList" :key="question.id" >
                    <div class="row align-items-center mt-4">
                        <div class="col text-center">{{ !question.answer.is_answered ? '답변대기' : '답변완료' }}</div>
                        <div class="col-6">
                            <a href="#" class="text-decoration-none text-black question-title" @click="handleTitleClick(question, $event)">
                                {{ question.title }}
                            </a>
                            <i v-if="question.is_secret" class="bi bi-lock-fill"></i>
                        </div>
                        <div class="col text-center">{{ question.author }}</div>
                        <div class="col text-center">{{ formatDate(question.created_at) }}</div>
                        <div class="col text-center">{{ formatDate(question.answer.answered_at) }}</div>
                        <div class="col text-center">{{ question.view_count }}</div>    
                    </div>
                    <div v-if="showContent === question.id" class="mt-2 question-content-area">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-md-10 offset-md-1 qna-content-area">
                                    <div class="d-flex justify-content-between align-items-end">
                                        <div class="fw-bold">질문 내용</div>
                                        <div>
                                            <!-- 문의 수정은 작성자만 가능하고 문의 삭제는 작성자와 관리자 모두 가능하도록 수정 예정 -->
                                            <button type="button" class="btn btn-outline-dark ms-2" id="control-review-btn" @click="updateQuestionForm(question)">문의 수정</button>
                                            <button type="button" class="btn btn-outline-dark ms-2" id="control-review-btn" @click="confirmDeleteQuestion(question)">문의 삭제</button>     
                                        </div>
                                    </div>
                                    
                                    <div class="mt-3">
                                        {{ questionContents[question.id] }}
                                    </div>
                                    
                                </div>
                            </div>
                            <hr v-if="question.answer.id" class="col-md-10 offset-md-1">
                            <div class="row">
                                <div class="col-md-10 offset-md-1 qna-content-area">
                                    <div class="d-flex justify-content-between align-items-end">
                                        <div v-if="question.answer.is_answered" class="fw-bold">관리자 답변</div>
                                        <div v-if="!question.answer.is_answered"></div>
                                        <div>
                                            <!-- 로그인 기능 생성 후 관리자가 로그인 했을 때만 활성화로 수정 예정 -->
                                            <button v-if="!question.answer.id" type="button" class="btn btn-outline-dark ms-2" id="control-review-btn" @click="toggleAnswerForm(question.id)" >관리자 답변 등록</button>
                                            <button v-if="question.answer.id" type="button" class="btn btn-outline-dark ms-2" id="control-review-btn" @click="updateAnswerForm(question)">관리자 답변 수정</button>
                                            <button v-if="question.answer.id" type="button" class="btn btn-outline-dark ms-2" id="control-review-btn" @click="confirmDeleteAnswer(question.answer.id)">관리자 답변 삭제</button>  
                                        </div>
                                        
                                    </div>  
                                    
                                    <div v-if="question.answer.id" class="mt-3">
                                        {{ answerContents[question.id] }}
                                    </div>
                                              
                                </div>
                            </div>
                            <!-- Answer Form Start -->
                            <form v-if="showAnswerForm === question.id" @submit.prevent="submitAnswer(question)" class="mt-3">
                                <div class="row">
                                    <div class="col-md-10 offset-md-1">
                                        <div class="form-floating mb-3">
                                            <textarea class="form-control" id="answer-content" v-model="answerContent" @input="limitAnswerTextLength" placeholder="최소 10자 이상 입력해주세요." required></textarea>
                                            <label for="answer-content">답변 내용을 입력해주세요. (최소 10자 / 최대 500자)</label>
                                            <div class="char-counter">{{ answerContent.length }} / {{ answerContentLenUpperBound }}</div>
                                            <div v-if="textLengthWarning" class="text-warning">{{ textLengthWarning }}</div>
                                        </div>
                                                
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
    props: ['classItem'],
    data() {
        return {
            showSubmitAlert: false,
            showUpdateAlert: false,
            showDeleteAlert: false,
            showQuestionForm: false,
            showAnswerForm: false,
            showContent: false,
            questionTitle: '',
            questionTitleLenLowerBound: 5,
            questionTitleLenUpperBound: 100,
            questionList: {},
            questionID: '',
            questionContents: {},
            questionContent: '',
            questionContentLenLowerBound: 10,
            questionContentLenUpperBound: 500,
            answerID: '',
            answerContents: {},
            answerContent: '',
            answerContentLenLowerBound: 10,
            answerContentLenUpperBound: 500,
            textLengthWarning: '',
            isSecret: false,
            isUpdating: false,
            paginator: {},
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
            const end = start + this.pagesPerGroup;
            return this.paginator.page_range.slice(start, end);
        },
        maxPageGroup() {
            return Math.ceil(this.paginator.page_range.length / this.pagesPerGroup) - 1;
        }
    },
    async mounted() {
        await this.getQuestionList();
    },
    methods: {
        async getQuestionList() {
            try {
                const response = await axios.get(`https://localhost:8000/common/question/read/class/`, {
                    params: {
                        glass_class_id: this.classItem.id,
                        page: this.page,
                        page_size: this.pageSize,
                        page_order: this.pageOrder,
                    }
                });
                
                if (response.status === 200) {
                    const questionData = response.data;
                    this.questionList = questionData.questions;
                    this.paginator = questionData.paginator;
                } else {
                    throw new Error('Failed to get questions');
                }
            } catch (error) {
                console.error("There was a problem getting the questions.", error);
            }
        },
        async getQuestionContent(questionID) {
            try {
                const response = await axios.get(`https://localhost:8000/common/question/get-question-content/class/`, {
                    params: {
                        question_id: questionID,
                    },
                    withCredentials: true,
                });

                if (response.status === 200) {
                    const contentData = response.data;
                    this.questionContents[questionID] = contentData.question.content;
                    this.answerContents[questionID] = contentData.question.answer_content;
                } else {
                    throw new Error('Failed to get question content');
                }

            }   catch (error) {
                console.error("There was a problem getting the question content.", error);
            }
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
            try {
                const response = await axios.post('https://localhost:8000/common/question/create/class/', {
                    title: this.questionTitle,
                    content: this.questionContent,
                    is_secret: this.isSecret,
                }, {
                    params: {
                        glass_class_id: this.classItem.id,
                    },
                    withCredentials: true,
                });
                await this.getQuestionList();
                this.questionTitle = '';
                this.questionContent = '';
                this.showQuestionForm = false;
                this.showSubmitAlert = true;
            } catch (error) {
                console.error("There was a problem submitting the question.", error);
            }
        },
        updateQuestionForm(question) {
            this.questionID = question.id;
            this.questionTitle = question.title;
            this.questionContent = question.content;
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
            try {
                const response = await axios.post(`https://localhost:8000/common/question/update/class/`, {
                    title: this.questionTitle,
                    content: this.questionContent,
                    is_secret: this.isSecret,
                }, {
                    params: {
                        question_id: this.questionID,
                    },
                    withCredentials: true,
                });
                if (response.status === 200) {
                    await this.getQuestionList(); // Get reviews again to update the list
                    this.questionID = '';
                    this.questionTitle = '';
                    this.questionContent = '';
                    this.isSecret = false;
                    this.showQuestionForm = false;  // Hide the form after submitting the review
                    this.isUpdating = false;
                    this.showUpdateAlert = true;  // Show the success alert
                } else {
                    throw new Error('Failed to update review');
                }
            } catch (error) {
                console.error("There was a problem updating the question.", error);
            }
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
            try {
                const response = await axios.delete(`https://localhost:8000/common/question/delete/class/`, {
                    params: {
                        question_id: this.questionID,
                    },
                    withCredentials: true,
                });
                await this.getQuestionList();
                this.showDeleteAlert = true;
            } catch (error) {
                console.error("There was a problem deleting the question.", error);
            }
        },
        async handleTitleClick(question, event) {
            event.preventDefault();
            const questionID = question.id;

            // Content가 보이는 상태라면 조회수를 증가시키지 않음
            if (this.showContent !== questionID) {
                if (!this.questionContents[questionID]) {
                    await this.getQuestionContent(questionID);
                }
                await this.increaseViewCount(question);
                this.showContent = questionID;
            } else {
                if (this.answerContent.length > 0) {
                    this.confirmResetAnswerForm();
                } else {
                    this.showAnswerForm = false;
                }
                this.showContent = false;
            }

        },
        async increaseViewCount(question) {
            try {
                const response = await axios.post(`https://localhost:8000/common/question/increase-view-count/`, {}, {
                    params: {
                        question_id: question.id,
                    },
                    withCredentials: true,
                });
                
                if (response.status === 200) {
                    const data = response.data;
                    question.view_count = data.view_count;
                }
            }   catch (error) {
                console.error("There was a problem increasing the view count.", error);
            }
        },
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
            try {
                const response = await axios.post(`https://localhost:8000/common/answer/create/class/`, {
                    content: this.answerContent,
                }, {
                    params: {
                        question_id: questionID,
                    },
                    withCredentials: true,
                });
                await this.getQuestionList();
                this.answerContent = '';
                this.showAnswerForm = false;
                this.showSubmitAlert = true;
            } catch (error) {
                console.error("There was a problem submitting the answer.", error);
            }
        },
        updateAnswerForm(question) {
            this.answerID = question.answer.id;
            this.answerContent = question.answer.content;
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
            try {
                const response = await axios.post(`https://localhost:8000/common/answer/update/class/`, {
                    content: this.answerContent,
                }, {
                    params: {
                        answer_id: this.answerID,
                    },
                    withCredentials: true,
                });
                if (response.status === 200) {
                    await this.getQuestionList(); // Get reviews again to update the list
                    this.answerID = '';
                    this.answerContent = '';
                    this.showAnswerForm = false;
                    this.isUpdating = false;
                    this.showUpdateAlert = true;
                } else {
                    throw new Error('Failed to update review');
                }
            } catch (error) {
                console.error("There was a problem updating the answer.", error);
            }
        },
        confirmDeleteAnswer(answerID) {
            if (!answerID) {
                alert('답변 ID를 확인해주시고 다시 시도해주세요.');
            }

            if (confirm('답변을 삭제하시겠습니까?')) {
                this.deleteAnswer(answerID);
            } else {
                return;
            }
        },
        async deleteAnswer(answerID) {
            try {
                const response = await axios.delete(`https://localhost:8000/common/answer/delete/class/`, {
                    params: {
                        answer_id: answerID,
                    },
                    withCredentials: true,
                });
                await this.getQuestionList();
                this.showDeleteAlert = true;
            } catch (error) {
                console.error("There was a problem deleting the answer.", error);
            }
        },
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
                this.questionTitle = '';
                this.questionContent = '';
                this.showQuestionForm = false;
            }
        },
        confirmResetAnswerForm() {
            if (confirm('작성 중인 답변을 모두 지우시겠습니까?')) {
                this.answerContent = '';
                this.showAnswerForm = false;
            }
        },
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

.question-btn {
    width: 90px;
}

/* Question content */
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