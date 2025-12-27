<template>
    <Header />
    <div class="container mt-4">
      <div
        class="course-card shadow-sm animate__animated animate__zoomIn smooth-hover"
      >
        <div class="card-body">
          <h1 class="card-title text-purple">{{ course.title }}</h1>
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
    data.fetchAssignmentsResults(auth.token, auth.user.id)
});

function formatDate(dateStr) {
    return dateStr.split('T')[0];
}
</script>

<style scoped>
.card-title{
    color: #6f42c1;
}
.course-card {
  border-radius: 1rem;
  background-color: #f9f3fc;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: transform 0.3s ease, box-shadow 0.4s ease;
}

.course-card:hover {
    cursor:pointer;
  transform: translateY(-5px);
  box-shadow:
    0 4px 20px rgba(111, 66, 193, 0.3),
    0 0 10px rgba(111, 66, 193, 0.2);
}

.neon-border {
  border: 2px solid #ff4d94;
  box-shadow:
    0 0 5px #ff4d94,
    0 0 10px #ff4d94,
    0 0 20px #ff4d94,
    0 0 40px #ff99c8;
  transition: box-shadow 0.4s ease;
}

.neon-border:hover {
  box-shadow:
    0 0 10px #ff4d94,
    0 0 20px #ff4d94,
    0 0 40px #ff99c8,
    0 0 60px #ffb3d1;
}

</style>