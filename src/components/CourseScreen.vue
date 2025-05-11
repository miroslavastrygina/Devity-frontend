<template>
    <Header />
    <div class="container mt-4">
        <div class="card shadow-sm">
            <div class="card-body">
                <h1 class="card-title">{{ course.title }}</h1>
                <p class="text-muted mb-2">Создан: {{ formatDate(course.created_at) }}</p>
                <p class="card-text">{{ course.description }}</p>
            </div>
        </div>
        <BlockList :blocks="course.block" />
    </div>
</template>

<script setup>
import Header from "./Header.vue";
import { useDataStore } from '@/stores/data';
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BlockList from './BlockListScreen.vue';

const { id } = defineProps({
    id: String
});

const data = useDataStore();
const auth = useAuthStore();
const router = useRouter();
const course = data.findCourse(id);

onMounted(() => {
    if (!auth.isAuthenticated) {
        router.push('/login');
    }

    data.fetchCourses(auth.token);
    data.fetchBlcoks(auth.token);
    data.fetchLessons(auth.token);
});

function formatDate(dateStr) {
    return dateStr.split('T')[0];
}
</script>