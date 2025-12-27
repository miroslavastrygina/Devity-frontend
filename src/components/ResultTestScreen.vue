<template>
    <Header />
  
    <div class="container mt-4">
      <div v-if="result" class="card shadow-lg border-0 animate__animated animate__fadeIn">
        <!-- Шапка -->
        <div class="card-header bg-gradient text-white d-flex justify-content-between align-items-center result-header">
          <h5 class="mb-0">Результаты теста</h5>
          <router-link
            :to="`/lesson/${result.test.lesson.id}`"
            class="btn btn-outline-light btn-sm fw-semibold return-btn"
            @click="goToLesson"
          >
            ← Вернуться к уроку
          </router-link>
        </div>
  
        <!-- Контент -->
        <div class="card-body">
          <div class="row">
            <!-- Пользователь -->
            <div class="col-md-6 mb-4">
              <div class="info-box">
                <h6 class="text-secondary">Пользователь</h6>
                <ul class="list-unstyled mb-0">
                  <li><strong>ФИО:</strong> {{ auth.user.surname }} {{ auth.user.name }} {{ auth.user.patronymic }}</li>
                  <li><strong>Email:</strong> {{ auth.user.email }}</li>
                  <li><strong>Телефон:</strong> {{ auth.user.phone }}</li>
                </ul>
              </div>
            </div>
  
            <!-- Тест -->
            <div class="col-md-6 mb-4">
              <div class="info-box">
                <h6 class="text-secondary">Тест</h6>
                <ul class="list-unstyled mb-0">
                  <li><strong>Название:</strong> {{ result.test.title }}</li>
                  <li><strong>Таймер:</strong> {{ result.test.timer }} мин</li>
                  <li><strong>Дата:</strong> {{ formatDate(result.created_at) }}</li>
                </ul>
              </div>
            </div>
          </div>
  
          <hr />
  
          <!-- Результаты -->
          <div class="row text-center">
            <div class="col-md-6 animate__animated animate__fadeInUp">
              <h6 class="text-muted">Верных ответов</h6>
              <p :class="pointsClass" class="display-6 result-box">{{ result.avg_points }}</p>
            </div>
            <div class="col-md-6 animate__animated animate__fadeInUp">
              <h6 class="text-muted">Процент</h6>
              <p :class="percentClass" class="display-6 result-box">{{ result.avg_percent }}%</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Загрузка -->
      <div v-else class="text-center mt-5 animate__animated animate__fadeIn">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Загрузка...</span>
        </div>
      </div>
    </div>
  </template>
  
<script setup>
import { onMounted, ref, computed } from 'vue';
import { useDataStore } from '@/stores/data';
import { useAuthStore } from '@/stores/auth';
import Header from './Header.vue';
import { useRouter, useRoute } from 'vue-router';

const auth = useAuthStore();
const data = useDataStore();
const router = useRouter();
const route = useRoute();

const result = ref(null);

const formatDate = (dateStr) => dateStr.split('T')[0];

// Получить и сохранить результат
onMounted(async () => {
    if (!auth.isAuthenticated) {
        router.push('/login');
        return;
    }

    const res = await data.findResultsTest(auth.token, route.params.id);
    console.log(result);
    if (res?.data) {
        result.value = res.data;
        console.log(result);

    }
});

// Классы Bootstrap для цвета по баллам
const pointsClass = computed(() => {
    if (!result.value) return '';
    const points = result.value.avg_points;
    if (points >= 80) return 'text-success fw-bold';
    if (points >= 0.5) return 'text-warning fw-bold';
    return 'text-danger fw-bold';
});

const percentClass = computed(() => {
    if (!result.value) return '';
    const percent = result.value.avg_percent;
    if (percent >= 80) return 'text-success fw-bold';
    if (percent >= 50) return 'text-warning fw-bold';
    return 'text-danger fw-bold';
});
</script>

<style scoped>
/* Шапка блока */
.result-header {
  background: linear-gradient(90deg, #4a5568, #2d3748) !important;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  padding: 1rem 1.5rem;
  color: white !important;
}

/* Кнопка назад */
.return-btn {
  border-radius: 0.5rem;
  padding: 0.4rem 0.8rem;
  transition: 0.3s;
}
.return-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color:white;
  text-decoration: none;
}

/* Блоки с данными */
.info-box {
  border: 1px solid #e2e8f0;
  background-color: #f8f9fa;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  font-size: 0.95rem;
}

/* Цифры результатов */
.result-box {
  background-color: #edf2f7;
  border-radius: 0.75rem;
  padding: 1rem;
  font-weight: bold;
  color: #2c5282;
  box-shadow: inset 0 0 10px rgba(44, 82, 130, 0.05);
}
</style>
