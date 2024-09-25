<template>
    <div class="container mt-5" ref="reviewForm">
        <!-- Review Summary -->
        <div class="container d-flex justify-content-between">
            <div>
                <h4>{{ contentTitle }}</h4>
                <span class="text-black text-opacity-50">{{ contentItem.short_description }}</span> 
            </div>
            <div v-if="isAdmin">
                <button class="btn btn-outline-dark" @click="updateDetailInfoForm">상품 정보 수정하기</button>
            </div>
        </div>
        <hr class="border border-dark opacity-100 mb-4">
        <!-- Update Detail Info Form -->
        <div v-if="showForm" class="container mt-5">
            <form @submit.prevent="updateDetailInfo">
                <div class="form-group row mb-2">
                    <label for="detailInfoDesctiprion-1" class="col-sm-2 col-form-label">설명 문단 1</label>
                    <div class="col-sm-10">
                        <textarea type="text" class="form-control detail-form" id="detailInfoDesctiprion-1" v-model="detailInfoForm.description_1"></textarea>
                    </div>
                </div>
                <div class="form-group row mb-2">
                    <label for="detailInfoDesctiprion-2" class="col-sm-2 col-form-label">설명 문단 2</label>
                    <div class="col-sm-10">
                        <textarea class="form-control detail-form" id="detailInfoDesctiprion-2" v-model="detailInfoForm.description_2"></textarea>
                    </div>
                </div>
                <div class="form-group row mb-2">
                    <label for="detailInfoDesctiprion-3" class="col-sm-2 col-form-label">설명 문단 3</label>
                    <div class="col-sm-10">
                        <textarea class="form-control detail-form" id="detailInfoDesctiprion-3" v-model="detailInfoForm.description_3"></textarea>
                    </div>
                </div>
                <div class="form-group row mb-4">
                    <label for="detailInfoImage" class="col-sm-2 col-form-label">상품 이미지</label>
                    <div class="col-sm-10">
                        <div>
                            <input type="file" class="form-control-file mb-3" id="detailInfoImage" @change="handleImageUpload($event, 'product')">
                        </div>
                        <img v-if="imagePreview" :src="imagePreview" class="preview-img" alt="상품 이미지">
                    </div>
                </div>
                <div class="form-group row mb-4">
                    <label for="detailInfoImage" class="col-sm-2 col-form-label">공지 이미지</label>
                    <div class="col-sm-10">
                        <div>
                            <input type="file" class="form-control-file mb-3" id="noticeImage" @change="handleImageUpload($event, 'notice')">
                        </div>
                        <img v-if="noticeImagePreview" :src="noticeImagePreview" class="preview-img" alt="공지 이미지">
                    </div>
                </div>
                <div class="form-group row mb-4">
                    <label for="detailInfoImage" class="col-sm-2 col-form-label">이벤트 이미지</label>
                    <div class="col-sm-10">
                        <div>
                            <input type="file" class="form-control-file mb-3" id="eventImage" @change="handleImageUpload($event, 'event')">
                        </div>
                        <img v-if="eventImagePreview" :src="eventImagePreview" class="preview-img" alt="공지 이미지">
                    </div>
                </div>
                <div class="form-group mb-2">
                    <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-outline-dark me-2" @click="updateDetailInfoForm">취소하기</button>
                        <button type="submit" class="btn btn-dark" @click="confirmUpdateDetailInfo">수정하기</button>
                    </div>
                </div>
            </form>
        </div>

        <!-- Detail Info -->
        <div class="container mb-5">
            <div v-if="detailInfo.notice_image">
                {{ detailInfo.notice_image }}
            </div>
            <div v-if="detailInfo.event_image">
                {{ detailInfo.event_image }}
            </div>

            <div class="row">
                <div :class="['col-md-6', 'fade-in', { show: showProductImage }]">
                    <img :src="detailInfo.product_image" class="detail-info-img" alt="상품 이미지">
                </div>
                <div class="col-md-6">
                    <div :class="['fade-in', { show: showDescription1 }, 'mb-3']">
                        {{ detailInfo.description_1 }}
                    </div>
                    <div :class="['fade-in', { show: showDescription2 }, 'mb-3']">
                        {{ detailInfo.description_2 }}
                    </div> 
                    <div :class="['fade-in', { show: showDescription3 }]">
                        {{ detailInfo.description_3 }}
                    </div>
                </div>
            </div>
        </div>
    </div>  
</template>

<script>
import axios from 'axios';

export default {
    props: ['classItem', 'productItem'],
    data() {
        return {
            /* Initialize detail tab */
            contentItem: this.classItem ? this.classItem : this.productItem,
            contentTitle: this.classItem ? '클래스 상세정보' : '상품 상세정보',
            isAdmin: false,

            /* detail info */
            detailInfo: {},

            /* product information notice */
            productNotice: {},

            /* fade-in control */
            showProductImage: false,
            showDescription1: false,
            showDescription2: false,
            showDescription3: false,

            /* detail info form */
            showForm: false,
            detailInfoForm: {
                description_1: '',
                description_2: '',
                description_3: '',
                product_image: null,
                notice_image: null,
                event_image: null,
            },
            imagePreview: null,
            noticeImagePreview: null,
            eventImagePreview: null,
        }
    },
    
    async mounted() {
        await this.isAdimin();
        await this.getDetailInfo();
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

        /* Content Control */
        // Get detail info from server
        async getDetailInfo() {
            await axios
                .get(`${process.env.VUE_APP_API_URL}common/detail-info/get_detail_info/`, {
                    params: {
                        class_id: this.classItem ? this.classItem.id : null,
                        product_id: this.productItem ? this.productItem.id : null,
                    },
                    withCredentials: true,
                })
                .then((response) => {
                    this.detailInfo = response.data.detail_info;
                    this.showContent();
                    console.log(this.detailInfo);
                })
                .catch((error) => {
                    console.error(error.response);
                });
        },

        // Update Detail Info
        updateDetailInfoForm() {
            if (!this.showForm) {
                this.showForm = true;
                this.detailInfoForm = {
                    description_1: this.detailInfo.description_1,
                    description_2: this.detailInfo.description_2,
                    description_3: this.detailInfo.description_3,
                    product_image: this.detailInfo.product_image,
                    notice_image: this.detailInfo.notice_image,
                    event_image: this.detailInfo.event_image,
                };
            } else {
                this.confirmCancelUpdate();
            }
        },
        confirmUpdateDetailInfo(event) {
            event.preventDefault();

            if (confirm('상품 정보를 수정하시겠습니까?')) {
                this.updateDetailInfo();
            } else {
                return;
            }
        },
        async updateDetailInfo() {
            const formData = new FormData();
            formData.append('description_1', this.detailInfoForm.description_1);
            formData.append('description_2', this.detailInfoForm.description_2);
            formData.append('description_3', this.detailInfoForm.description_3);
            
            // class_id or product_id
            if (this.classItem) {
                formData.append('glass_class', this.classItem.id);
            } else if (this.productItem) {
                formData.append('product', this.productItem.id);
            }

            // Image가 있을 때만 formdata에 append
            console.log(this.detailInfoForm.product_image);
            console.log(this.detailInfoForm.notice_image);
            console.log(this.detailInfoForm.event_image);

            if (this.detailInfoForm.product_image) {
                formData.append('product_image', this.detailInfoForm.product_image);
            }
            if (this.detailInfoForm.notice_image) {
                formData.append('notice_image', this.detailInfoForm.notice_image);
            }
            if (this.detailInfoForm.event_image) {
                formData.append('event_image', this.detailInfoForm.event_image);
            }

            await axios
                .post(`${process.env.VUE_APP_API_URL}common/detail-info/update_detail_info/`, formData, {
                    params: {
                        detail_info_id: this.detailInfo.id,
                    },
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    withCredentials: true,
                })
                .then((response) => {
                    console.log(response.data);
                    this.showForm = false;
                    this.resetForm();
                    this.getDetailInfo();
                    alert('상품 정보가 수정되었습니다.');
                })
                .catch((error) => {
                    console.error(error.response);
                });
        },
        handleImageUpload(event, type) {
            const file = event.target.files[0];
            if (!file) return;
    
            this.setDetailInfoFormImage(type, file);
            this.readFile(file, type);
        },
        setDetailInfoFormImage(type, file) {
            switch (type) {
                case 'product':
                    this.detailInfoForm.product_image = file;
                    break;
                case 'notice':
                    this.detailInfoForm.notice_image = file;
                    break;
                case 'event':
                    this.detailInfoForm.event_image = file;
                    break;
                default:
                    console.error('Unknown type:', type);
            }
        },
        readFile(file, type) {
            const reader = new FileReader();
            reader.onload = () => {
                this.setImagePreview(type, reader.result);
            };
            reader.readAsDataURL(file);
        },
        setImagePreview(type, result) {
            switch (type) {
                case 'product':
                    this.imagePreview = result;
                    break;
                case 'notice':
                    this.noticeImagePreview = result;
                    break;
                case 'event':
                    this.eventImagePreview = result;
                    break;
                default:
                    console.error('Unknown type:', type);
            }
        },
        confirmCancelUpdate() {
            if (confirm('수정을 취소하시겠습니까?')) {
                this.showForm = false;
                this.resetForm();
            }
        },
        resetForm(){
            this.detailInfoForm = {
                description_1: '',
                description_2: '',
                description_3: '',
                image: null,
                notice_image: null,
                event_image: null,
            };
            this.imagePreview = null;
            this.noticeImagePreview = null;
            this.eventImagePreview = null;
        },

        /* Show Content */
        showContent() {
            // Fade-in effect control
            setTimeout(() => { this.showProductImage = this.detailInfo.product_image ? true : false; }, 500);
            setTimeout(() => { this.showDescription1 = this.detailInfo.description_1 ? true : false; }, 1000);
            setTimeout(() => { this.showDescription2 = this.detailInfo.description_2 ? true : false; }, 1500);
            setTimeout(() => { this.showDescription3 = this.detailInfo.description_3 ? true : false; }, 2000);
        },
    }
}
</script>

<style scoped>
/* Detail Info */
.detail-info-img {
    width: 100%;
}
.fade-in {
    opacity: 0;
    transition: opacity 0.5s ease-in;
}
.fade-in.show {
    opacity: 1;
}
.info-head {
    font-size: 1.1em;
    font-weight: bold;
}
.table {
    font-size: 0.8em;
}
.table-field {
    background-color: #f7f7f7;
}

/* Update detail Info Form */
.detail-form{
    width: 100%;
    resize: none;
}
.preview-img {
    width: 15em;
}
</style>