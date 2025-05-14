<template>
    <Header />
    <div class="container mt-4">
        <div class="card shadow-sm">
            <div class="card-body">
                <h1 class="card-title">{{ lesson.title }}</h1>
                <p class="text-muted mb-2">Создан: {{ formatDate(lesson.created_at) }}</p>
                <div class="card-text markdown-body" v-html="htmlContent" ref="contentRef"></div>
            </div>
        </div>
    </div>
    <TestList :tests="lesson.tests" />
</template>

<script setup>
import { ref, computed, onMounted, onUpdated } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // тёмная тема

import Header from "./Header.vue";
import TestList from './TestListScreen.vue';
import { useDataStore } from '@/stores/data';
import { useAuthStore } from '@/stores/auth';

const { id } = defineProps({
    id: String
});

const contentRef = ref(null);
const data = useDataStore();
const auth = useAuthStore();
const lesson = data.findLesson(id);

const htmlContent = computed(() => marked.parse(lesson.content || ''));

function formatDate(dateStr) {
    return dateStr.split('T')[0];
}

function highlightCode() {
    if (contentRef.value) {
        contentRef.value.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });
    }
}

onMounted(() => {
    if (!auth.isAuthenticated) {
        router.push('/login');
    }

    data.fetchCourses(auth.token);
    data.fetchBlcoks(auth.token);
    data.fetchLessons(auth.token);
    data.fetchTests(auth.token);

    highlightCode();
});

onUpdated(() => {
    highlightCode();
});
</script>

<style scoped>
.markdown-body pre {
    background-color: #1e1e1e;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    color: #fff;
}

.markdown-body code {
    font-family: 'Fira Code', monospace;
    font-size: 0.95rem;
}
</style>
  
