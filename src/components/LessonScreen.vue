<template>
    <Header />
    <div class="container mt-4">
        <div class="card shadow-sm">
            <div class="card-body">
                <h1 class="card-title">{{ lesson.title }}</h1>
                <p class="text-muted mb-2">Создан: {{ formatDate(lesson.created_at) }}</p>
                <div class="card-text" v-html="htmlContent"></div>
            </div>
        </div>
    </div>
    <TestList :tests="lesson.tests" />
</template>

<script setup>
import Header from "./Header.vue";
import { onMounted } from 'vue';
import { useDataStore } from '@/stores/data';
import { useAuthStore } from '@/stores/auth';
import TestList from './TestListScreen.vue';
import { marked } from 'marked';
import { computed } from 'vue';

const { id } = defineProps({
    id: String
});

const data = useDataStore();
const auth = useAuthStore();
const lesson = data.findLesson(id);

const htmlContent = computed(() => {
    return marked.parse(lesson.content || '');
});

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