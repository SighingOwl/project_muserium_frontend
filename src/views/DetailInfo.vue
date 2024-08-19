<template>
    <div class="container mt-5" ref="reviewForm">
        <!-- Review Summary -->
        <div class="container d-flex justify-content-between">
            <div>
                <h4>클래스 상세정보 -> class model의 class.name 혹은 '클래스 상세정보'</h4>
                <span class="text-black text-opacity-50">클래스의 진행 안내입니다. -> class model의 short.describtion을 활용 예정 </span> 
            </div>
        </div>
        <hr class="border border-dark opacity-100">
    </div>  
</template>

<script>
export default {
    props: ['activeTab', 'classItem'],
}
</script>

<style></style>