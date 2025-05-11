<template>
    <Header />
    <div class="container mt-4">
        <div class="card shadow-sm">
            <div class="card-body">
                <h1 class="card-title">{{ block.title }}</h1>
                <p class="text-muted mb-2">Создан: {{ formatDate(block.created_at) }}</p>
                <p class="card-text">{{ block.description }}</p>
            </div>
        </div>
    </div>
    <LessonList :lessons="block.lessons" />
</template>

<script setup>
import Header from "./Header.vue";
import { useDataStore } from '@/stores/data';
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';
import LessonList from './LessonListScreen.vue';

const { id } = defineProps({
    id: String
});

const data = useDataStore();
const auth = useAuthStore();
const block = data.findBlock(id);

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