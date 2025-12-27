<template>
    <Header />
    <div class="container mt-4">
      <div class="card shadow-sm lesson-card animate__animated animate__fadeInUp">
        <div class="card-body">
          <h1 class="card-title text-purple">{{ lesson.title }}</h1>
          <p class="text-muted mb-2">Создан: {{ formatDate(lesson.created_at) }}</p>
          <div class="card-text markdown-body" v-html="htmlContent" ref="contentRef"></div>
        </div>
      </div>
    </div>
    <TestList :tests="lesson.tests" />
    <AssignmentListScreen v-if="lesson.assignments" :assignments="lesson.assignments" />
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
import AssignmentListScreen from './AssignmentListScreen.vue';

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
    data.fetchAssignments(auth.token);
    data.fetchAssignmentsResults(auth.token, auth.user.id)

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

.lesson-card {
  background-color: #f9f3fc;
  border-radius: 1rem;
  padding: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.lesson-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(111, 66, 193, 0.15);
}

.text-purple {
  color: #6f42c1;
}
</style>

