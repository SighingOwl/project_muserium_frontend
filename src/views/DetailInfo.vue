<template>
    <div class="container mt-5" ref="reviewForm">
        <!-- Review Summary -->
        <div class="container d-flex justify-content-between">
            <div>
                <h4>클래스 상세정보 -> class model의 class.name 혹은 '클래스 상세정보'</h4>
                <span class="text-black text-opacity-50">{{ classItem.short_description }}</span> 
            </div>
        </div>
        <hr class="border border-dark opacity-100">
        <div class="container">
            <div v-for="(image, index) in detailImages" :key="index" class="d-flex justify-content-center align-items-center">
                <img :src="image.image" alt="class detail image" class="img-fluid detail-info-img mb-2">
            </div>
        </div>
    </div>  
</template>

<script>
import axios from 'axios';

export default {
    props: ['classItem'],
    data() {
        return {
            detailImages: '',
        }
    },
    async mounted() {
        await this.getDetailImages();
    },
    methods: {
        async getDetailImages() {
            try {
                const response = await axios.get(`https://localhost:8000/common/detail-info/get_detail_info/`, {
                    params : {
                        class_id: this.classItem.id,
                    },
                    withCredentials: true,
                });

                if (response.status === 200) {
                    this.detailImages = response.data;

                } else {
                    console.error(response.message);
                }
            } catch (error) {
                console.error('Failed to get detail images', error);
            }
        }
    }
}
</script>

<style scoped>
.detail-info-img {
    width: 70%;
}

</style>