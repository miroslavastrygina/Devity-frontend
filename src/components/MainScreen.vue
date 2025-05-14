<template>
    <div>
        <Header />
        <div class="container mt-3">
            <div class="mb-4 text-center">
                Добро пожаловать!
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <CourseList />
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
import  CourseList  from "./CourseListScreen.vue";
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
    if(auth.user === null) {
        getUserData();
    }

    data.fetchCourses(auth.token);
    data.fetchBlcoks(auth.token);
    data.fetchLessons(auth.token);
    data.fetchTests(auth.token);
});

</script>