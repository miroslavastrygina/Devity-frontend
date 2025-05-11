<template>
    <router-link :to="`/course/${course.id}`" class="text-decoration-none text-dark">
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">{{ course.title }}</h5>
                <p class="card-text">От {{ course.created_at.split('T')[0] }}</p>
            </div>
        </div>
    </router-link>
</template>

<script setup>
defineProps({
    course: Object
});
</script>

<style scoped>
.card {
    cursor: pointer;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: scale(1.05);
}
</style>
