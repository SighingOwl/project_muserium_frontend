<template>
    <div>
        <h2>회원정보 수정</h2>
        <form @submit.prevent="submitForm" class="mt-5">
            <div class="row mb-3">
                <div class="col-md-2">
                    <span>이름</span>
                </div>
                <div class="col-md-4">
                    <input type="text" class="form-control" id="name" v-model="form.name" disabled readonly>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-2">
                    <span>이메일</span>
                </div>
                <div class="col-md-4">
                    <input type="email" class="form-control" id="email" v-model="form.email" disabled readonly>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-2">
                    <span>비밀번호</span>
                </div>
                <div class="col-md-4">
                    <input v-if="!changePassword" type="password" class="form-control" id="password" placeholder="********" disabled>
                    <div v-if="changePassword" class="mb-3">
                        <input type="password" class="form-control" id="current-password" placeholder="현재 비밀번호" v-model="form.currentPassword">
                    </div>
                    <div v-if="changePassword" class="mb-3">
                        <input type="password" class="form-control" id="password" placeholder="새 비밀번호 / 8~16자의 영어, 숫자, 특수문자 조합" v-model="form.password">
                    </div>
                    <div v-if="changePassword" class="mb-3">
                        <input type="password" class="form-control" id="password-check" placeholder="비밀번호 확인" v-model="form.passwordCheck">
                    </div>
                </div>
                <div class="col-md-3">
                    <button type="button" class="btn btn-outline-dark" @click="handlePassword()">비밀번호 변경</button>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-2">
                    <span>전화번호</span>
                </div>
                <div class="col-md-4">
                    <input type="tel" class="form-control" id="mobile" placeholder="01012345678" v-model="form.mobile" required>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-2">
                    <span>주소</span>
                </div>
                <div class="col-md-6">
                    <div class="row mb-3">
                        <div class="col-md-3">
                            <input type="text" class="form-control" id="postcode" placeholder="우편번호" v-model="form.postcode" readonly>
                        </div>
                        <div class="col-md-4">
                            <button type="button" class="btn btn-outline-dark" @click="getPostcode">우편번호 찾기</button>
                        </div>
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control" id="address" placeholder="주소" v-model="form.address" readonly>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <input type="text" class="form-control" id="detail-address" placeholder="상세주소" v-model="form.detailAddress">
                        </div>
                        <div class="col-md-6">
                            <input type="text" class="form-control" id="extra-address" placeholder="참고항목" v-model="form.extraAddress" readonly>
                        </div>
                        
                    </div>  
                    
                </div>
            </div>
            <div class="d-flex justify-content-center">
                <button type="submit" class="btn btn-outline-dark submit-btn">저장</button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            form: {
                name: '',
                email: '',
                mobile: '',
                currentPassword: '',
                password: '',
                passwordCheck: '',
                postcode: '',
                address: '',
                detailAddress: '',
                extraAddress: '',

            },
            changePassword: false,
        };
    },
    mounted() {
        this.setUserData()
    },
    methods: {
        setUserData() {
            const user = this.$store.getters.getUserInfo;
            this.form.name = user.name;
            this.form.email = user.email;
            this.form.mobile = user.mobile || '';
            this.form.postcode = user.postcode || '';
            this.form.address = user.address || '';
            this.form.detailAddress = user.address_detail || '';
            this.form.extraAddress = user.address_extra || '';
        },
        handlePassword() {
            if (this.changePassword) {
                this.changePassword = false;
                this.form.currentPassword = '';
                this.form.password = '';
                this.form.passwordCheck = '';
            } else {
                this.changePassword = true;
            }
        },
        getPostcode() {
            new daum.Postcode({
                oncomplete: data => {
                    if (data.userSelectedType === 'R') {
                        this.form.address = data.roadAddress;
                    } else {
                        this.form.address = data.jibunAddress;
                    }

                    if (data.userSelectedType === 'R') {
                        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                            this.form.extraAddress = data.bname;
                        }

                        if (data.buildingName !== '' && data.apartment === 'Y') {
                            this.form.extraAddress += (this.form.extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
                        }

                        if (this.form.extraAddress !== '') {
                            this.form.extraAddress = ' (' + this.form.extraAddress + ')';
                        }
                    } else {
                        this.form.extraAddress = '';
                    }

                    this.form.postcode = data.zonecode;
                    this.form.detailAddress = '';
                }
            }).open();
        },
        async submitForm() {
            if (this.changePassword) {
                if (!this.form.currentPassword) {
                    alert('현재 비밀번호를 입력하세요.');
                    return;
                }

                // 비밀번호 형식 검사
                const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
                if (!passwordPattern.test(this.form.password)) {
                    alert('비밀번호는 8~16자의 영문, 숫자, 특수기호 조합이어야 합니다.');
                    return;
                }

                // 기존 비밀번호와 새 비밀번호가 같은지 검사
                if (this.form.currentPassword === this.form.password) {
                    alert('기존 비밀번호와 새 비밀번호가 같습니다.');
                    return;
                }

                // 비밀번호 일치 검사
                if (this.form.password !== this.form.passwordCheck) {
                    alert('비밀번호가 일치하지 않습니다.');
                    return;
                }
            }
            
            if (this.form.mobile) {
                // 전화번호 형식 검사
                const mobilePattern = /^\d{10,11}$/;
                if (this.form.mobile && !mobilePattern.test(this.form.mobile)) {
                    alert('유효한 전화번호를 입력하세요.');
                    return;
                }    
            }

            if (this.form.postcode && !this.form.detailAddress) {
                alert('상세 주소를 입력하세요.');
                return;
            }
            
            // 모든 유효성 검사를 통과하면 폼 제출
            const config = {
                username: this.form.email,
                email: this.form.email,
                name: this.form.name,
                mobile: this.form.mobile,
                postcode: this.form.postcode,
                address: this.form.address,
                address_detail: this.form.detailAddress,
                address_extra: this.form.extraAddress,
            }

            await axios
                .post(`${process.env.VUE_APP_API_URL}accounts/auth/update-user/`, config, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        'current_password': this.form.currentPassword,
                        'new_password': this.form.password,
                    },
                    withCredentials: true,
                })
                .then((response) => {
                    if (response.status === 200) {
                        console.log(response.data);
                        this.$store.dispatch('updateUserData', config)
                        alert(response.data.message);
                        window.location.reload();
                    }
                })
                .catch((error) => {
                    console.error(error.response);
                    alert('회원정보 수정에 실패했습니다.');
                });
        }
    }
};
</script>

<style scoped>
.submit-btn {
    width: 100px;
    margin-top: 20px;
}
</style>