<template>
    <div class="container mt-5">
        <h2 class="text-purple mb-4 text-center">Доступные курсы</h2>
        <div class="row">
            <div class="col-md-4 mb-4" v-for="course in data.courses" :key="course.id">
                <CourseBlock :course="course" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useDataStore } from '@/stores/data';
import CourseBlock from './CourseBlockScreen.vue';

const data = useDataStore();
</script>

<style scoped>
.text-purple {
    color: #6f42c1;
}
</style>
  
