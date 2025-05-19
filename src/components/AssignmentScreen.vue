<template>
    <div class="container mt-4">
        <Header />

        <!-- Карточка с заданием -->
        <div class="card mb-4">
            <div class="card-body">
                <h5 class="card-title">{{ assignment.title }}</h5>
                <div class="card-text" v-html="htmlContent"></div>
            </div>
        </div>

        <!-- Форма загрузки файла -->
        <div class="card shadow-sm rounded-3 border-0">
            <div class="card-body">
                <h5 class="card-title mb-4">📎 Загрузите файл с решением</h5>
                <form @submit.prevent="handleSubmit">
                    <div class="mb-3">
                        <label for="fileInput" class="form-label">Выберите файл</label>
                        <input id="fileInput" class="form-control" type="file" @change="handleFileChange" required />
                    </div>
                    <button type="submit" class="btn btn-success w-100">
                        🚀 Отправить решение
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUpdated } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { useDataStore } from '@/stores/data';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Header from "./Header.vue";

const { id } = defineProps({ id: String });

const data = useDataStore();
const auth = useAuthStore();
const router = useRouter();

const assignment = data.findAssignment(id);
const htmlContent = computed(() => marked.parse(assignment.description || ''));
const selectedFile = ref(null);
let submissionData = ref(null);

onMounted(() => {
    if (!auth.isAuthenticated) {
        router.push('/login');
    }

    data.fetchCourses(auth.token);
    data.fetchBlcoks(auth.token);
    data.fetchLessons(auth.token);
    data.fetchTests(auth.token);
    data.fetchAssignments(auth.token);
});

onUpdated(() => {
    document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
    });
});

// Обработка выбора файла
const handleFileChange = (event) => {
    selectedFile.value = event.target.files[0];
};

// Обработка отправки формы
const handleSubmit = () => {
    if (!selectedFile.value) {
        alert("Пожалуйста, выберите файл.");
        return;
    }
    const submissionPayload = {
        file: selectedFile.value,
        assignment_id: assignment.id,
        user_id: auth.user.id,
        submitted_at: new Date().toISOString().slice(0, 10)
    };

    console.log("Файл для отправки:", selectedFile.value);
    data.uploadAssignmentFile(auth.token, submissionPayload);
};
</script>
