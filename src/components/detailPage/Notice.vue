<template>
    <div class="container mt-5" ref="reviewForm">
        <!-- Review Summary -->
        <div class="container d-flex justify-content-between">
            <div>
                <h4>배송 / 교환 안내</h4>
            </div>
            <div v-if="isAdmin">
                <button class="btn btn-outline-dark" @click="updateNoticeForm">배송 / 교환 안내 수정</button>
            </div>
        </div>
        <hr class="border border-dark opacity-100 mb-4">
        <div v-if="showEditor">
            <editor
                :api-key="apiKey"
                :init="tinymceSettings"
                v-model="content"
            ></editor>
            <div class='d-flex justify-content-end mt-3'>
                <button class="btn btn-dark" @click="confirmUpdateNotice">안내 수정</button>    
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Editor from '@tinymce/tinymce-vue';

export default {
    components: {
        Editor,
    },
    data() {
        return {
            /* User Permission */
            isAdmin: false,

            /* Notice Form */
            showEditor: false,
            apiKey: process.env.VUE_APP_TINYMCE_API_KEY,
            content: '',
            tinymceSettings: {
                height: 500,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
                    'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                resize: false,

                // 이미지 업로드 설정
                automatic_uploads: true,
                file_picker_types: 'image',
                file_picker_callback: this.filePickerCallback,
            }
        };
    },
    mounted() {
        this.isAdimin();
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

        /* Update Notice */
        updateNoticeForm() {
            this.content = '';
            this.showEditor = true;
        },

        filePickerCallback(callback, value, meta) {
            if (meta.filetype === 'image') {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.onchange = () => {
                    const file = input.files[0];
                    const reader = new FileReader();

                    reader.onload = (e) => {
                        const base64 = e.target.result;
                        callback(base64, { alt: file.name });
                    };
                    reader.readAsDataURL(file);
                };
                input.click();
            }
        },
        confirmUpdateNotice() {
            if (confirm('안내를 수정하시겠습니까?')) {
                this.updateNotice();
            }
        },
        async updateNotice() {
            console.log(this.content);
        }
    }
}
</script>

<style scoped>
</style>