<template>
    <div>
        <h1 class="mb-4">Курсы</h1>
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