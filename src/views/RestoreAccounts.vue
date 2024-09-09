<template>
    <div class="container">
        <div class="text-center">
            <img :src="brandLogoURL" alt="Musetium Logo" class="logo-img mt-5">    
        </div>
        <div class="d-flex flex-column justify-content-center align-items-center">
            <div class="col-md-7 mt-5">
                <h5>이메일 찾기</h5>
                <form @submit.prevent="findEmail">
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="name" placeholder="이름을 입력해주세요" v-model="name" required>
                        <label for="name" class="form-label">이름을 입력해주세요.</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="phone" placeholder="전화번호를 입력해주세요." v-model="phone" required>
                        <label for="phone" class="form-label">전화번호를 입력해주세요.</label>
                    </div>
                    <div class="d-flex justify-content-end">
                        <button type="submit" class="btn btn-outline-dark">이메일 찾기</button>    
                    </div>
                </form>
                <div v-if="isRestoreEmail" class="text-center my-3">
                    <span class="text-highlight">"{{ displayName }}"</span>
                    <span class="text-normal"> 님의 이메일은 </span>
                    <span class="text-highlight">"{{ restoredEmail }}"</span>
                    <span class="text-normal"> 입니다.</span>
                </div>
                <div v-if="emailNotFound" class="text-center my-3">
                    <span class="text-highlight">"{{ displayName }}"</span>
                    <span class="text-normal"> 님의 이메일을 찾을 수 없습니다.</span>
                </div>
            </div>
            <div class="col-md-7">
                <hr>
                <h5 class="mt-5">비밀번호 초기화</h5>
                <form @submit.prevent="resetPassword">
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="resetEmail" placeholder="이메일을 입력해주세요" v-model="resetEmail" required>
                        <label for="resetEmail" class="form-label">이메일을 입력해주세요.</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="resetName" placeholder="이름을 입력해주세요." v-model="resetName" required>
                        <label for="resetName" class="form-label">이름을 입력해주세요.</label>
                    </div>
                    <div class="d-flex justify-content-end">
                        <button type="submit" class="btn btn-outline-dark mb-5">비밀번호 초기화</button>    
                    </div>
                </form>
                <div v-if="isResetPassword" class="text-center my-3">
                    <span class="text-highlight">"{{ displayEmail }}"</span>
                    <span class="text-normal">로 초기화된 이메일을 전송했습니다.</span>
                    <p class="text-normal">{{ newPassword }}</p>
                </div> 
                <div v-if="userNotFound" class="text-center my-3">
                    <span class="text-highlight">"{{ displayEmail }}"</span>
                    <span class="text-normal"> 및 </span>
                    <span class="text-highlight">"{{ displayName }}"</span>
                    <span class="text-normal">과 매칭되는 사용자를 찾을 수 없습니다.</span>
                </div> 
            </div>    
        </div>
        
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            brandLogoURL: process.env.VUE_APP_BRAND_FOOTER_LOGO_URL,
            name: '',
            phone: '',
            displayName: '',
            restoredEmail: '',
            resetEmail: '',
            resetName: '',
            isRestoreEmail: false,
            emailNotFound: false,
            isResetPassword: false,
            displayEmail: '',
            newPassword: '',
            userNotFound: false,
        };
    },
    methods: {
        async clearDisplay() {
            this.displayName = '';
            this.restoredEmail = '';
            this.isRestoreEmail = false;
            this.emailNotFound = false;
            this.isResetPassword = false;
            this.displayEmail = '';
            this.newPassword = '';
            this.userNotFound = false;
        },
        async findEmail() {
            // 결과 화면 초기화
            await this.clearDisplay();

            // 필수 입력 항목 체크
            if (this.name === '' || this.phone === '') {
                alert('이름과 전화번호를 입력해주세요.');
                return;
            }

            // 전화번호 유효성 체크
            const phonePattern = /^[0-9]{10,11}$/;
            if (!phonePattern.test(this.phone)) {
                alert('유효한 전화번호를 입력해주세요.');
                return;
            }

            const config = {
                    name: this.name,
                    mobile: this.phone
                }

            await axios
                .post(`${process.env.VUE_APP_API_URL}accounts/auth/restore-email/`, config, {
                    withCredentials: true,
                })
                .then((response) => {
                    if (response.status === 200) {
                        this.restoredEmail = response.data.email;
                        this.displayName = this.name;
                        this.isRestoreEmail = true;
                    }
                })
                .catch((error) => {
                    if (error.response.status === 400) {
                        alert(error.response.data.error);
                    } else if (error.response.status === 404) {
                        this.displayName = this.name;
                        this.emailNotFound = true;
                    }

                });
        },
        async resetPassword() {
            // 결과 화면 초기화
            await this.clearDisplay();

            // 필수 입력 항목 체크
            if (this.resetEmail === '' || this.resetName === '') {
                alert('이메일과 이름을 입력해주세요.');
                return;
            }

            // 이메일 유효성 체크
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(this.resetEmail)) {
                alert('유효한 이메일 주소를 입력해주세요.');
                return;
            }
            
            const config = {
                email: this.resetEmail,
                name: this.resetName,
            }

            await axios
                .post(`${process.env.VUE_APP_API_URL}accounts/auth/reset-password/`, config,{
                    withCredentials: true,
                })
                .then((response) => {
                    if (response.status === 200) {
                        this.displayEmail = this.resetEmail;
                        this.newPassword = response.data.password;
                        this.isResetPassword = true;
                    }
                })
                .catch((error) => {
                    if (error.response.status === 400) {
                        alert(error.response.data.error);
                    } else if (error.response.status === 404) {
                        this.displayEmail = this.resetEmail;
                        this.displayName = this.resetName;
                        this.userNotFound = true;
                    }
                });

        }
    }
};
</script>

<style scoped>
.logo-img {
    width: 25%;
}

.text-normal {
    font-size: 1.1rem;
}

.text-highlight {
    font-size: 1.3rem;
    font-weight: bold;
}
</style>