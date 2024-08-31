<template>
    <div class="container d-flex flex-column justify-content-center align-items-center">
        <h2 class="mt-5">회원가입</h2>
        <form @submit.prevent="submitForm" class="w-75 d-flex flex-column justify-content-center align-items-center mt-4">
            <div class="container">
                <div class="row mb-3">
                    <div class="col-md-3">
                        <label for="email" class="form-label">* 이메일</label>
                    </div>
                    <div class="col-md-6">
                        <input type="email" class="form-control" id="email" placeholder="이메일을 입력해주세요." v-model="form.email" required>
                    </div>
                    <div class="col-md-3">
                        <button type="button" class="btn btn-outline-dark" @click="checkEmail">중복확인</button>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-3">
                        <label for="password" class="form-label">* 비밀번호</label>
                    </div>
                    <div class="col-md-6">
                        <input type="password" class="form-control" id="password" placeholder="비밀번호(8자~16자의 영문, 숫자, 특수기호 조합)" v-model="form.password" required>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-3">
                        <label for="password-check" class="form-label">* 비밀번호 확인</label>
                    </div>
                    <div class="col-md-6">
                        <input type="password" class="form-control" id="password-check" placeholder="비밀번호를 재입력해주세요." v-model="form.passwordCheck" required>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-3">
                        <label for="name" class="form-label">* 이름</label>
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" id="name" placeholder="이름을 입력해주세요." v-model="form.name">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-3">
                        <label for="phone" class="form-label">* 연락처</label>
                    </div>
                    <div class="col-md-6">
                        <input type="tel" class="form-control" id="phone" placeholder="'-' 기호없이 숫자만 작성해주세요." v-model="form.phone">
                    </div>
                </div>
            </div>
            <button type="submit" class="btn btn-outline-dark col-md-2 my-4">회원가입</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            form: {
                email: '',
                password: '',
                passwordCheck: '',
                name: '',
                phone: '',
                address: ''
            },
            isDuplicatedEmail: null,
        };
    },
    methods: {
        async checkEmail() {
            // 이메일 중복 확인
            // 중복되는 이메일이 있으면 this.errorMessage에 '중복된 이메일입니다.'를 할당
            // 중복되는 이메일이 없으면 this.errorMessage에 ''를 할당

            // 이메일 형식 검사
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(this.form.email)) {
                this.isDuplicatedEmail = null;
                alert('유효한 이메일 주소를 입력하세요.');
                console.log(this.isDuplicatedEmail);
                return;
            }

            const config = {
                params: {
                    email: this.form.email
                },
                withCredentials: true
            };

            await axios.get(`${process.env.VUE_APP_API_URL}/accounts/auth/check-email/`, config)
                        .then((response) => {
                            if (response.data.exists) {
                                this.isDuplicatedEmail = true;
                                alert('이미 사용 중인 이메일입니다.');
                            } else {
                                this.isDuplicatedEmail = false;
                                alert('사용 가능한 이메일입니다.');
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
            console.log(this.isDuplicatedEmail);


        },
        async submitForm() {
            this.errorMessage = '';

            // 이메일 형식 검사
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(this.form.email)) {
                alert('유효한 이메일 주소를 입력하세요.');
                return;
            }

            // 이메일 중복 검사
            if (this.isDuplicatedEmail === null) {
                alert('이메일 중복 확인을 해주세요.');
                return;
            } else if (this.isDuplicatedEmail) {
                alert('중복된 이메일입니다.');
                return;
            }
            
            // 비밀번호 형식 검사
            const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
            if (!passwordPattern.test(this.form.password)) {
                alert('비밀번호는 8~16자의 영문, 숫자, 특수기호 조합이어야 합니다.');
                return;
            }

            // 비밀번호 일치 검사
            if (this.form.password !== this.form.passwordCheck) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }

            // 전화번호 형식 검사
            const phonePattern = /^\d{10,11}$/;
            if (this.form.phone && !phonePattern.test(this.form.phone)) {
                alert('유효한 전화번호를 입력하세요.');
                return;
            }

            // 모든 유효성 검사를 통과하면 폼 제출
            const config = {
                username: this.form.email,
                email: this.form.email,
                password: this.form.password,
                name: this.form.name,
                mobile: this.form.phone,
            }
            await this.$store.dispatch('register', config);
            this.$router.push('/');
        }
    }
};
</script>

<style scoped>
/* 스타일 추가 가능 */
</style>