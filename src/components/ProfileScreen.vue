<template>
    <Header />
    <div class="container mt-5 mb-5 animate__animated animate__fadeIn">
      <div class="row justify-content-center">
        <div class="col-12 col-xl-10">
          <div class="card shadow-lg rounded-4 p-4 profile-card">
            <div class="card-header bg-purple text-white rounded-3 mb-4">
              <h5 class="mb-0">Профиль пользователя</h5>
            </div>
            <div class="card-body">
              <div class="row g-4">
                <div class="col-12 col-lg-6">
                  <div class="mb-4">
                    <label class="form-label fw-semibold">Имя</label>
                    <input v-model="form.name" type="text" class="form-control rounded-3 px-3 py-2" />
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-semibold">Фамилия</label>
                    <input v-model="form.surname" type="text" class="form-control rounded-3 px-3 py-2" />
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-semibold">Отчество</label>
                    <input v-model="form.patronymic" type="text" class="form-control rounded-3 px-3 py-2" />
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-semibold">Телефон</label>
                    <input v-model="form.phone" type="text" class="form-control rounded-3 px-3 py-2" />
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-semibold">Email</label>
                    <input v-model="form.email" type="email" class="form-control rounded-3 px-3 py-2" />
                  </div>
                </div>
                <div class="col-12 col-lg-6">
                  <div class="profile-stats">
                    <h6 class="mb-2">Статистика достижений</h6>
                    <p class="text-muted mb-3">В этом разделе отображаются все награды за прогресс.</p>
                    <div class="d-flex flex-wrap gap-2">
                      <span class="stat-pill">Открыто: {{ achievements.unlockedCount }}</span>
                      <span class="stat-pill">Всего: {{ achievements.items.length }}</span>
                      <span class="stat-pill">Очки: {{ achievements.totalPoints }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="successMessage" class="alert alert-success py-3 rounded-3" role="alert">
                {{ successMessage }}
              </div>
  
              <div v-if="errorMessage" class="alert alert-danger py-3 rounded-3" role="alert">
                {{ errorMessage }}
              </div>
  
              <div class="text-end">
                <button class="btn btn-purple fw-semibold rounded-pill px-4 py-2 shadow-sm hover-scale" @click="saveProfile">
                  Сохранить
                </button>
              </div>

              <AchievementsSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .bg-purple {
    background-color: #6f42c1;
  }
  
  .btn-purple {
    background-color: #6f42c1;
    color: white;
    transition: background-color 0.3s ease;
    border: none;
  }
  
  .btn-purple:hover {
    background-color: #5a36a1;
  }
  
  .hover-scale {
    transition: transform 0.2s ease;
  }
  
  .hover-scale:hover {
    transform: scale(1.05);
  }
  
  .form-label {
    font-size: 1rem;
  }
  
  .form-control {
    font-size: 1rem;
    box-shadow: inset 0 1px 3px rgb(0 0 0 / 0.1);
  }
  
  .card {
    border: none;
  }
  
  .card-header {
    padding: 1rem 1.5rem;
  }
  
  .card-body {
    padding: 0 1.5rem 1.5rem;
  }

  .profile-card {
    overflow: hidden;
  }

  .profile-stats {
    border: 1px solid #e8dfff;
    border-radius: 14px;
    background: #faf7ff;
    padding: 1rem;
  }

  .stat-pill {
    background-color: #f0e7ff;
    color: #5d2caf;
    border-radius: 999px;
    font-size: 0.82rem;
    padding: 0.35rem 0.75rem;
    font-weight: 600;
  }
  </style>
  

<script setup>
import Header from './Header.vue';
import AchievementsSection from './AchievementsSection.vue';
import { useAuthStore } from '@/stores/auth';
import { useAchievementsStore } from '@/stores/achievements';
import { reactive, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const auth = useAuthStore();
const achievements = useAchievementsStore();
const backendUrl = import.meta.env.VITE_APP_BACKEND;
const user_id = ref(auth.user?.id ?? null);

// форма
const form = reactive({
    name: auth.user?.name ?? '',
    surname: auth.user?.surname ?? '',
    patronymic: auth.user?.patronymic ?? '',
    phone: auth.user?.phone ?? '',
    email: auth.user?.email ?? '',
});

// сообщения
const successMessage = ref('');
const errorMessage = ref('');

async function saveProfile() {
    successMessage.value = '';
    errorMessage.value = '';

    if (!user_id.value) {
        errorMessage.value = 'Не удалось определить пользователя. Перезайдите в аккаунт.';
        return;
    }

    const response = await fetch(`${backendUrl}/user/update/${user_id.value}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),
        mode: 'cors'
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Ошибка валидации:', errorData);
        errorMessage.value = 'Ошибка при обновлении профиля. Проверьте данные.';
        return;
    }

    const result = await response.json();
    auth.setUserData(result.user);
    auth.saveToSessionStorage();
    successMessage.value = 'Данные профиля успешно обновлёны.';
}

onMounted(() => {
    if (!auth.isAuthenticated) {
        router.push('/login');
        return;
    }

    if (!auth.user) {
        auth.fetchCurrentUser();
    }

    achievements.fetchAchievements(auth.token);
});

watch(
    () => auth.user,
    (user) => {
        if (!user) {
            return;
        }

        user_id.value = user.id;
        form.name = user.name ?? '';
        form.surname = user.surname ?? '';
        form.patronymic = user.patronymic ?? '';
        form.phone = user.phone ?? '';
        form.email = user.email ?? '';
    },
    { immediate: true }
);
</script>