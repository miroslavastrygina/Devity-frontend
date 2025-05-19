<template>
    <Header />
    <div class="container mt-4">
        <div class="card shadow-sm">
            <div class="card-body">
                <h1 class="card-title">{{ test.title }}</h1>
                <div v-if="!started">
                    <p class="text-muted">Тест начнётся, как только вы нажмёте "Старт"</p>
                    <button class="btn btn-success" @click="startTest">Старт</button>
                </div>

                <div v-else>
                    <p class="fw-bold text-danger mb-3">Оставшееся время: {{ formattedTime }}</p>

                    <form @submit.prevent="submitAnswers">
                        <div v-for="(question, index) in test_questions" :key="question.id" class="mb-3">
                            <label class="form-label">Вопрос {{ index + 1 }}: {{ question.question }}</label>
                            <input v-model="answers[question.id]" type="text" class="form-control"
                                placeholder="Ваш ответ" />
                        </div>
                        <button class="btn btn-success" type="submit">Отправить</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUpdated } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

import Header from './Header.vue';
import { useDataStore } from '@/stores/data';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const { id } = defineProps({
    id: String
});

const data = useDataStore();
const auth = useAuthStore();
const router = useRouter();
const test = data.findTest(id);
const test_questions = test.test_questions;

const started = ref(false);
const answers = ref({});
const timer = ref(0);
const interval = ref(null);
let timerOff = false;

// преобразуем минуты из float в секунды
const durationSeconds = Math.round(test.timer * 60);

function startTest() {
    started.value = true;
    timer.value = durationSeconds;

    interval.value = setInterval(() => {
        if (timer.value > 0 && !timerOff) {
            timer.value--;
        } else {
            clearInterval(interval.value);
            alert("Время вышло!");
            data.saveAnswers(auth.token, answers.value, auth.user.id)
        }
    }, 1000);
}

const formattedTime = computed(() => {
    const minutes = Math.floor(timer.value / 60);
    const seconds = timer.value % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

async function submitAnswers() {
    const resultId = await data.saveAnswers(auth.token, answers.value, auth.user.id); 
    console.log(resultId);
    router.push('/results/' + resultId);
}

onMounted(() => {
    if (!auth.isAuthenticated) {
        router.push('/login');
    }

    data.fetchCourses(auth.token);
    data.fetchBlcoks(auth.token);
    data.fetchLessons(auth.token);
    data.fetchTests(auth.token);
});

onUpdated(() => {
    document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
    });
});
</script>