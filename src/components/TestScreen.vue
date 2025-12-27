<template>
    <Header />
    <div class="container mt-4">
      <div class="card shadow-sm test-card animate__animated animate__fadeIn">
        <div class="card-body">
          <h1 class="card-title text-purple">{{ test.title }}</h1>
  
          <div v-if="!started" class="animate__animated animate__fadeIn">
            <p class="text-muted">Тест начнётся, как только вы нажмёте "Старт"</p>
            <button class="btn btn-start" @click="startTest">Старт</button>
          </div>
  
          <div v-else class="animate__animated animate__fadeIn">
            <p class="timer-box">Оставшееся время: <span>{{ formattedTime }}</span></p>
  
            <form @submit.prevent="submitAnswers">
              <div
                v-for="(question, index) in test_questions"
                :key="question.id"
                class="mb-4 animate__animated animate__fadeInUp"
              >
                <label class="form-label fw-semibold">Вопрос {{ index + 1 }}: {{ question.question }}</label>
                <input
                  v-model="answers[question.id]"
                  type="text"
                  class="form-control custom-input"
                  placeholder="Ваш ответ"
                />
              </div>
              <button class="btn btn-submit mt-3" type="submit">Отправить</button>
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
    data.fetchAssignmentsResults(auth.token, auth.user.id)
});

onUpdated(() => {
    document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
    });
});
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

.test-card {
  background-color: #f9f3fc;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: box-shadow 0.3s ease;
}

.test-card:hover {
  box-shadow: 0 8px 24px rgba(111, 66, 193, 0.15);
}

.text-purple {
  color: #6f42c1;
}

.custom-input {
  border: 1px solid #d1b3ff;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.custom-input:focus {
  outline: none;
  border-color: #6f42c1;
  box-shadow: 0 0 0 0.2rem rgba(111, 66, 193, 0.25);
}

.btn-start,
.btn-submit {
  background-color: #6f42c1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.25rem;
  transition: background-color 0.3s ease;
}

.btn-start:hover,
.btn-submit:hover {
  background-color: #5a34a0;
}

.timer-box {
  background-color: #f1e6ff;
  border-left: 4px solid #6f42c1;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: bold;
  color: #6f42c1;
  margin-bottom: 1.5rem;
}
</style>
