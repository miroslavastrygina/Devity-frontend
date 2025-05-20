<template>
    <Header />
    <div class="container mt-4 animate__animated animate__fadeIn">
      <!-- Карточка с заданием -->
      <div
        class="assignment-card mt-4 mb-4 shadow-sm animate__animated animate__fadeInUp smooth-hover"
      >
        <div class="card-body">
          <h5 class="card-title text-purple fw-bold">{{ assignment.title }}</h5>
          <div class="card-text markdown-body" v-html="htmlContent"></div>
        </div>
      </div>
  
      <!-- Сообщение об успешной отправке -->
      <div
        v-if="submissionSuccess"
        class="alert alert-success d-flex justify-content-between align-items-center animate__animated animate__fadeIn"
      >
        <span>Решение отправлено успешно!</span>
        <router-link
          :to="`/lesson/${assignment.lesson_id}`"
          class="btn btn-purple rounded-pill"
        >
           Вернуться к уроку
        </router-link>
      </div>
  
      <!-- Форма загрузки файла -->
      <div
        v-else
        class="upload-card shadow-sm animate__animated animate__fadeInUp smooth-hover"
      >
        <div class="card-body">
          <h5 class="card-title mb-4 text-purple">📎 Загрузите файл с решением</h5>
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="fileInput" class="form-label text-secondary">Выберите файл</label>
              <input
                id="fileInput"
                class="form-control border border-secondary-subtle rounded-3"
                type="file"
                @change="handleFileChange"
                required
              />
            </div>
            <button type="submit" class="btn btn-purple w-100 fw-semibold rounded-pill">
              🚀 Отправить решение
            </button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUpdated } from 'vue'
  import { marked } from 'marked'
  import hljs from 'highlight.js'
  import 'highlight.js/styles/github-dark.css'
  import { useDataStore } from '@/stores/data'
  import { useAuthStore } from '@/stores/auth'
  import { useRouter } from 'vue-router'
  import Header from './Header.vue'
  
  const { id } = defineProps({ id: String })
  
  const data = useDataStore()
  const auth = useAuthStore()
  const router = useRouter()
  
  const assignment = data.findAssignment(id)
  const htmlContent = computed(() => marked.parse(assignment.description || ''))
  const selectedFile = ref(null)
  const submissionSuccess = ref(false)
  
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
  
  onUpdated(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block)
    })
  })
  
  // Обработка выбора файла
  const handleFileChange = (event) => {
    selectedFile.value = event.target.files[0]
  }
  
  // Обработка отправки формы
  const handleSubmit = () => {
    if (!selectedFile.value) {
      alert('Пожалуйста, выберите файл.')
      return
    }
  
    const submissionPayload = {
      file: selectedFile.value,
      assignment_id: assignment.id,
      user_id: auth.user.id,
      submitted_at: new Date().toISOString().slice(0, 10),
    }
  
    data.uploadAssignmentFile(auth.token, submissionPayload)
    submissionSuccess.value = true
  }
  </script>
  
  <style scoped>
  .assignment-card,
  .upload-card {
    background-color: #f9f3fc;
    border-radius: 1rem;
    padding: 1.5rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .smooth-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(111, 66, 193, 0.15);
  }
  
  .text-purple {
    color: #6f42c1;
  }
  
  .btn-purple {
    background-color: #6f42c1;
    color: #fff;
    border: none;
  }
  
  .btn-purple:hover {
    background-color: #5a36a1;
  }
  </style>
  