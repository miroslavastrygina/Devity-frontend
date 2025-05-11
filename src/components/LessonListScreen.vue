<template>
    <div class="container mt-4">
        <h2>Уроки</h2>
        <div class="row">
            <div class="col-md-4 mb-4 " v-for="lesson in lessons">
                <router-link :to="`/lesson/${lesson.id}`" class="text-decoration-none text-dark">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">{{ lesson.title }}</h5>
                            <p class="card-text">От {{ lesson.created_at.split('T')[0] }}</p>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>

const { id } = defineProps({
    lessons: Array
});

</script>