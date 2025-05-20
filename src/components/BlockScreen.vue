<template>
    <Header />
    <div class="container mt-4">
      <div
        class="block-card shadow-sm animate__animated animate__zoomIn smooth-hover"
      >
        <div class="card-body">
          <h1 class="card-title text-purple">{{ block.title }}</h1>
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
    data.fetchAssignmentsResults(auth.token, auth.user.id)
});


function formatDate(dateStr) {
    return dateStr.split('T')[0];
}
</script>

<style scoped>
.block-card {
  background-color: #f9f3fc;
  border-radius: 1rem;
  padding: 1.5rem; /* Явно задаём внутренний отступ */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.smooth-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(111, 66, 193, 0.15);
}

.text-purple {
  color: #6f42c1;
}
</style>