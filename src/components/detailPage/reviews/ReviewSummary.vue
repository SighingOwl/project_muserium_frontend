<template>
    <div class="container mt-5" ref="reviewForm">
        <!-- Review Summary -->
        <div class="container d-flex justify-content-between">
            <div>
                <h4>클래스 리뷰</h4>
                <span class="text-black text-opacity-50">클래스를 수강하신 분들이 작성한 리뷰입니다.</span> 
            </div>
            <div class="review-rating-summary">
                <h3>{{ averageRating.toFixed(1) }} / 5.0</h3>
                <div class="star-rating">
                    <span v-for="star in 5" :key="star" class="star" :style="getStarStyle(star, averageRating)">&#9733;</span>
                </div>
            </div>
        </div>
        <hr class="border border-dark opacity-100">
    </div>
</template>

<script>
export default {
    props: {
        averageRating: {
            type: Number,
            required: true
        }
    },
    methods: {
        getStarStyle(star, rating) {
            const filledPercentage = Math.min(Math.max(rating - (star - 1), 0), 1) * 100;
            return {
                background: `linear-gradient(90deg, #000000 ${filledPercentage}%, #cccccc ${filledPercentage}%)`,
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent'
            };
        }
    }
}
</script>

<style>
.review-rating-summary {
    display: flex;
    flex-direction: column;
    align-items: center;
}

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
</style>