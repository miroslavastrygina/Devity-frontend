<template>
  <Header />
  <div class="min-vh-100 p-4 bg-light-purple">
    <h1 class="text-center text-purple fw-bold mb-4">Результаты</h1>

    <div v-if="data.results.length" class="d-flex flex-wrap justify-content-center gap-4">
      <div
        v-for="result in data.results"
        :key="result.id"
        class="card shadow-lg p-4 result-card"
        :class="{ 'neon-border': result.score < 40 }"
      >
        <h5 class="text-purple mb-3">Результат №{{ result.id }}</h5>
        <p>
          <strong class="text-purple">Задание:</strong> {{ result.submission.assignment.title }}
        </p>
        <p><strong class="text-purple">Оценка:</strong> {{ result.score }} из 100</p>
        <p><strong class="text-purple">Отзыв:</strong> {{ result.feedback }}</p>
        <p>
          <strong class="text-purple">Проверил:</strong> {{ result.teacher.surname }}
          {{ result.teacher.name }} {{ result.teacher.patronymic }}
        </p>
        <p><strong class="text-purple">Создано:</strong> {{ formatDate(result.created_at) }}</p>
        <p><strong class="text-purple">Обновлено:</strong> {{ formatDate(result.updated_at) }}</p>
      </div>
    </div>

    <p v-else class="text-center text-muted mt-4">Нет результатов для отображения.</p>
  </div>
</template>

<script setup>
import Header from './Header.vue'
import { onMounted } from 'vue'
import { useDataStore } from '@/stores/data'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const data = useDataStore()
const auth = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (!auth.isAuthenticated) {
    router.push('/login')
  }

  data.fetchCourses(auth.token)
  data.fetchBlcoks(auth.token)
  data.fetchLessons(auth.token)
  data.fetchTests(auth.token)
  data.fetchAssignments(auth.token)
  data.fetchAssignmentsResults(auth.token, auth.user.id)
})

function formatDate(dateString) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateString).toLocaleDateString('ru-RU', options)
}
</script>

<style scoped>
.bg-light-purple {
  background-color: #f3e8ff;
}

.text-purple {
  color: #6f42c1;
}

.result-card {
  width: 400px;
  border-radius: 1rem;
  background-color: #f9f3fc;
  transition:
    transform 0.3s ease,
    box-shadow 0.4s ease;
}

.result-card:hover {
    cursor:pointer;
  transform: translateY(-5px);
  box-shadow:
    0 4px 20px rgba(111, 66, 193, 0.3),
    0 0 10px rgba(111, 66, 193, 0.2);
}
/* Неоновая обводка для плохих оценок */
.neon-border {
  box-shadow:
    0 0 5px #ff4d94,
    0 0 10px #ff4d94,
    0 0 20px #ff4d94,
    0 0 40px #ff99c8;
  border: 2px solid #ff4d94;
}
</style>
