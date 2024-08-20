<template>
    <div class="container">
        <div v-if="classItem" class="row justify-content-between">
            <!-- Class Reservation Start -->
            <div class="col-md-5">
                <img :src="classItem.image_url" class="img-fluid" alt="Class Image">
            </div>
            <div class="col-md-5 mb-5">
                <div class="card border-0">
                    <div class="card-body">
                        <h5 class="card-title">{{ classItem.title }}</h5>
                        <p class="card-text">{{ classItem.short_description }}</p>
                        <div class="price-tag">
                            <p class="card-text" v-if="classItem.discount_rate">
                                <span class="text-muted text-decoration-line-through">{{ formattedOriginPrice }}원</span>
                                <br>
                                <span class="cur_price">{{ classItem.discount_rate }}% {{ formattedDiscountedPrice }}원</span>
                            </p>
                            <p class="card-text cur_price" v-else>
                                {{ formattedOriginPrice }}원
                            </p>
                        </div>
                        <hr class="mt-4">
                        <form class="container-fluid">
                            <div class="my-3">
                                <label for="datePicker" class="form-label">수강 날짜</label>
                                <div class="flatpickr input-group">
                                    <a class="input-button input-group-text" title="toggle" data-toggle>
                                        <i class="bi bi-calendar"></i>
                                    </a>
                                    <input class="input-style" type="text" placeholder="  수강 날짜를 선택해주세요." aria-label="class-date" data-input>
                                </div>
                                <flat-pickr class="visually-hidden" id="class_datepicker" v-model="selectedDate" :config="{ disable: disabledDates, minDate: today, maxDate: maxDate, wrap: true }">
                                </flat-pickr>
                            </div>
                            <div class="my-3" v-if="selectedDate">
                                <label for="timePicker" class="form-label">수강 시간</label>
                                <select id="timePicker" class="form-select" v-model="selectedTime">
                                    <option v-for="time in availableTimes" :key="time" :value="time" :disabled="disabledTimezones.includes(time)">{{ formatTime(time) }}</option>
                                </select>
                            </div>
                            <div class="d-flex justify-content-end mt-3">
                                <button class="btn btn-dark" @click="reserveClass">Reserve</button>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </div>
            <!-- Class Reservation End -->
            <!-- Class Information Nav Start -->
            <div class="container mt-5" id="class_info" ref="class_info_container">
                <ul class="nav nav-underline row d-flex justify-content-center" id="class_info_nav" ref="class_info_nav">
                    <li class="nav-item col-md-3" id="class_info_nav_list">
                        <a class="nav-link text-black" id="class_info_nav_link" :class="{ active: activeTab === 'details'}" @click="setActiveTap('details')">상세정보</a>
                    </li>
                    <li class="nav-item col-md-3">
                        <a class="nav-link text-black" id="class_info_nav_link" :class="{ active: activeTab === 'reviews'}" @click="setActiveTap('reviews')">클래스 리뷰</a>
                    </li>
                    <li class="nav-item col-md-3">
                        <a class="nav-link text-black" id="class_info_nav_link" :class="{ active: activeTab === 'qna'}" @click="setActiveTap('qna')">Q&A</a>
                    </li>
                </ul>
            </div>
            <!-- Class Information Nav End -->
            <!-- Class Information Start -->
            <div>
                <component :is="currentTabComponent" :classItem="classItem" :activeTab="activeTab"></component>
            </div>
            <!-- Class Information End -->
        </div>
        <div v-else>
            <p>Loading...</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import DetailInfo from './DetailInfo.vue';
import Reviews from './Reviews.vue';
import QnA from './QnA.vue';

export default {
    components: {
        flatPickr,
    },
    props: ['classID'],
    data() {
        const today = new Date();
        const maxDate = new Date();
        maxDate.setMonth(today.getMonth() + 1);

        return {
            classItem: null,
            reservations: [],
            today: today,
            maxDate: maxDate,
            disabledDates: [],
            selectedDate: null,
            selectedTime: null,
            availableTimes: ['10:00:00', '12:00:00', '14:00:00', '16:00:00'],
            disabledTimezones: [],
            activeTab: 'details',
            navTop: 0,
        };
    },
    computed: {
        discountedPrice() {
            if (this.classItem && this.classItem.discount_rate) {
                return this.classItem.price * (1 - this.classItem.discount_rate / 100);
            }
        },
        formattedOriginPrice() {
            return this.classItem.price.toLocaleString();
        },
        formattedDiscountedPrice() {
            return this.discountedPrice.toLocaleString();
        },
        currentTabComponent() {
            switch (this.activeTab) {
                case 'details':
                    return DetailInfo;
                case 'reviews':
                    return Reviews;
                case 'qna':
                    return QnA;
            }
        }
    },
    watch: {
        selectedDate(newDate) {
            this.updateDisabledTimes();
        }
    },
    mounted() {
        this.getClassDetail();
        this.getResvations();
        this.updateDisabledDates();
        this.setFixedNavWidth();
        window.addEventListener('resize', this.setFixedNavWidth);
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.setFixedNavWidth);
    },
    methods: {
        async getClassDetail() {
            try {
                const response = await axios.get(`https://localhost:8000/class/detail/get_class_detail/`, {
                    params: {
                        id: this.classID,
                    },
                });

                if (response.status === 200) {
                    this.classItem = response.data;
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    this.$router.push({ name: 'NotFound' });
                } else {
                    console.error("Failed to fetch class detail", error);
                }
            }
        },
        formatTime(time) {
            const [hours, minutes] = time.split(':');
            const period = hours < 12 ? 'AM' : "PM";
            const formattedHours = hours % 12 || 12;
            return `${formattedHours}:${minutes} ${period}`;
        },
        async submitReservations() {
            try {
                const response = await axios.post(`https://localhost:8000/class/reservations/`, {
                    class_id: this.classID,
                    date: this.selectedDate,
                    time: this.selectedTime,
                }, {
                    withCredentials: true,
                });
            } catch (error) {
                console.error("Failed to submit reservation", error);
            }
        },
        async getResvations() {
            try {
                const response = await axios.get(`https://localhost:8000/class/reservation/list_reservations/`, {
                    params: {
                        class_id: this.classID,
                    },
                });
                this.reservations = response.data;
                this.updateDisabledDates();
            } catch (error) {
                console.error("Failed to get reservations", error);
            }
        },
        async updateDisabledDates() {
            try {
                const response = await axios.get(`https://localhost:8000/class/reservation/get_disabled_dates/`);

                if (response.status === 200) {
                    this.disabledDates = response.data;
                } else {
                    console.error("Failed to update disabled dates", response);
                }
            } catch (error) {
                console.error("Failed to update disabled dates", error);
            }
        },
        async updateDisabledTimes() {
            try {
                const response = await axios.get(`https://localhost:8000/class/reservation/get_disabled_timezones/`, {
                    params: {
                        selected_date: this.selectedDate,
                    },
                });

                if (response.status === 200) {
                    this.disabledTimezones = response.data;
                } else {
                    console.error("Failed to update disabled times", response);
                }
            } catch (error) {
                console.error("Failed to update disabled times", error);
            }  
        },
        reserveClass() {
            if (this.selectedDate && this.selectedTime) {
                alert(`Class reserved on ${this.selectedDate} at ${this.selectedTime}`);
            } else {
                alert('Please select both date and time.');
            }
        },
        setActiveTap(tab) {
            this.activeTab = tab;
        },
        handleScroll() {
            const nav = document.getElementById('class_info_nav');
            const scrollY = window.scrollY;
            const navbarHeight = document.querySelector('.navbar').offsetHeight;

            if (this.navTop === 0) {
                this.navTop = nav.offsetTop;
            }

            if (nav.style.width === '') {
                this.setFixedNavWidth();
            }

            if (scrollY >= this.navTop - navbarHeight) {
                nav.classList.add('fixed-nav');
                nav.style.top = `${navbarHeight}px`;
            } else {
                nav.classList.remove('fixed-nav');
                nav.style.top = 'initial';
            }
        },
        setFixedNavWidth() {
            const container = this.$refs.class_info_container;
            const fixedNav = this.$refs.class_info_nav;
            if (container && fixedNav) {
                fixedNav.style.width = `${container.offsetWidth}px`;
            }
        }
    },
    
};
</script>

<style scoped>
.cur_price {
    font-size: 1.3rem;
}

.form-label {
    display: block;
    font-size: 1.1rem;
}

.input-style{
    width: 90%;
    border-width: 1px;
    border-color: #DFE2E6;
    border-style: solid;
}

#class_info_nav_link {
    text-align: center;
}

.fixed-nav {
    position: fixed;
    z-index: 1000;
    background-color: #ffffff;
}
</style>