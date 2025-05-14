<template>
    <Header />
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-6"> <!-- Средняя ширина формы -->
                <div class="card shadow-sm">
                    <div class="card-header">
                        <h5 class="mb-0">Профиль пользователя</h5>
                    </div>
                    <div class="card-body">
                        <!-- Имя -->
                        <div class="mb-3">
                            <label class="form-label">Имя</label>
                            <input v-model="form.name" type="text" class="form-control" />
                        </div>

                        <!-- Фамилия -->
                        <div class="mb-3">
                            <label class="form-label">Фамилия</label>
                            <input v-model="form.surname" type="text" class="form-control" />
                        </div>

                        <!-- Отчество -->
                        <div class="mb-3">
                            <label class="form-label">Отчество</label>
                            <input v-model="form.patronymic" type="text" class="form-control" />
                        </div>

                        <!-- Телефон -->
                        <div class="mb-3">
                            <label class="form-label">Телефон</label>
                            <input v-model="form.phone" type="text" class="form-control" />
                        </div>

                        <!-- Email -->
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input v-model="form.email" type="email" class="form-control" />
                        </div>
                        <!-- Сообщение об успехе -->
                        <div v-if="successMessage" class="alert alert-success" role="alert">
                            {{ successMessage }}
                        </div>

                        <!-- Сообщение об ошибке -->
                        <div v-if="errorMessage" class="alert alert-danger" role="alert">
                            {{ errorMessage }}
                        </div>
                        <!-- Кнопка -->
                        <div class="text-end">
                            <button class="btn btn-success" @click="saveProfile">Сохранить</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Header from './Header.vue';
import { useAuthStore } from '@/stores/auth';
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const auth = useAuthStore();
const backendUrl = import.meta.env.VITE_APP_BACKEND;
const user_id = auth.user.id;

// форма
const form = reactive({
    name: auth.user.name,
    surname: auth.user.surname,
    patronymic: auth.user.patronymic,
    phone: auth.user.phone,
    email: auth.user.email,
});

// сообщения
const successMessage = ref('');
const errorMessage = ref('');

async function saveProfile() {
    successMessage.value = '';
    errorMessage.value = '';

    const response = await fetch(`${backendUrl}/user/update/${user_id}`, {
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
    }
});
</script>