<template>
    <div>
        <Header /> <!-- Верхняя строка всегда присутствует -->

        <div class="d-flex flex-column flex-md-row vh-100">
            <!-- Левая половина с изображением -->
            <div class="w-100 w-md-50 bg-image d-none d-md-block"></div>

            <!-- Правая половина с приветствием -->
            <div class="w-100 w-md-50 d-flex justify-content-center align-items-center bg-light p-4">
                <div class="text-center px-3">
                    <!-- Крупный заголовок -->
                    <h1 class="text-purple fw-bold mb-4 display-3">Добро пожаловать!</h1>

                    <!-- Более крупное описание -->
                    <p class="text-muted fs-4 mb-5">
                        Готовы начать обучение? Погрузитесь в курс и откройте для себя новое!
                    </p>

                    <!-- Большая кнопка -->
                    <RouterLink to="/course/7" class="btn btn-purple btn-xl px-5 py-3 fs-4">
                        Начать курс
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useDataStore } from '@/stores/data';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import CourseList from "./CourseListScreen.vue";
import Header from "./Header.vue";

const auth = useAuthStore();
const data = useDataStore();
const router = useRouter();
const backendUrl = import.meta.env.VITE_APP_BACKEND;

async function getUserData() {
    const response = await fetch(`${backendUrl}/user`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Accept': 'application/json'
        },
        mode: 'cors'
    });

    if (!response.ok) {
        console.error('Ошибка получения данных пользователя');
        router.push('/login');
    } else {
        const result = await response.json();
        console.log(result);

        auth.setUserData(result);
        auth.saveToSessionStorage();
    }
}

onMounted(() => {
    if (!auth.isAuthenticated) {
        router.push('/login');
    }
    if (auth.user === null) {
        getUserData();
    }

    data.fetchCourses(auth.token);
    data.fetchBlcoks(auth.token);
    data.fetchLessons(auth.token);
    data.fetchTests(auth.token);
    data.fetchAssignments(auth.token);
    data.fetchAssignmentsResults(auth.token, auth.user.id)
});

</script>

<style scoped>
.bg-image {
    background-image: url('src/assets/9bbd9de495f1b05e9abc8f6490c324df.jpg');
    /* Укажите путь к своему изображению */
    background-size: cover;
    background-position: center;
}

.btn-xl {
    font-size: 1.5rem;
    padding: 0.75rem 2rem;
}

.text-purple {
    color: #6f42c1;
}

.btn-purple {
    background-color: #6f42c1;
    border: none;
    color: white;
}

.btn-purple:hover {
    background-color: #5a34a0;
}
</style>
  
