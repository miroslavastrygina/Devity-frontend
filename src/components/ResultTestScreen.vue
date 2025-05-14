<template>
    <Header />

    <div class="container mt-4">
        <div v-if="result" class="card shadow-lg border-0">
            <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Результаты теста</h5>
                <router-link :to="`/lesson/${result.test.lesson.id}`" class="btn btn-success btn-sm" @click="goToLesson">Вернуться к
                    уроку</router-link>
            </div>

            <div class="card-body">
                <div class="row">
                    <!-- Левая колонка: пользователь -->
                    <div class="col-md-6 mb-4">
                        <h6 class="text-muted">Пользователь</h6>
                        <ul class="list-unstyled">
                            <li><strong>ФИО:</strong> {{ auth.user.surname }} {{ auth.user.name }} {{
                                auth.user.patronymic }}</li>
                            <li><strong>Email:</strong> {{ auth.user.email }}</li>
                            <li><strong>Телефон:</strong> {{ auth.user.phone }}</li>
                        </ul>
                    </div>

                    <!-- Правая колонка: информация о тесте -->
                    <div class="col-md-6 mb-4">
                        <h6 class="text-muted">Тест</h6>
                        <ul class="list-unstyled">
                            <li><strong>Название:</strong> {{ result.test.title }}</li>
                            <li><strong>Таймер:</strong> {{ result.test.timer }} мин</li>
                            <li><strong>Дата:</strong> {{ formatDate(result.created_at) }}</li>
                        </ul>
                    </div>
                </div>

                <hr>

                <!-- Результаты -->
                <div class="row text-center">
                    <div class="col-md-6">
                        <h6>Верных ответов</h6>
                        <p :class="pointsClass" class="display-6">{{ result.avg_points }}</p>
                    </div>
                    <div class="col-md-6">
                        <h6>Процент</h6>
                        <p :class="percentClass" class="display-6">{{ result.avg_percent }}%</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Загрузка -->
        <div v-else class="text-center mt-5">
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
