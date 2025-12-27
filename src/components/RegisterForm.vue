<template>
    <div class="d-flex justify-content-center align-items-center min-vh-100 bg-image"
        :style="{ backgroundImage: `url(${backgroundImage})` }">
        <div class="card p-4 shadow-lg" style="width: 600px; border-radius: 1rem; background-color: #f9f3fc;">
            <h2 class="text-center mb-4 text-purple">Регистрация</h2>

            <form @submit.prevent="submitRegistration">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="first_name" class="form-label text-purple">Имя</label>
                        <input v-model="firstName" type="text" class="form-control" id="first_name" required />
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="last_name" class="form-label text-purple">Фамилия</label>
                        <input v-model="lastName" type="text" class="form-control" id="last_name" required />
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="middle_name" class="form-label text-purple">Отчество</label>
                        <input v-model="middleName" type="text" class="form-control" id="middle_name" required />
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="phone" class="form-label text-purple">Телефон</label>
                        <input v-model="phone" type="tel" class="form-control" id="phone" required />
                    </div>

                    <div class="col-md-12 mb-3">
                        <label for="email" class="form-label text-purple">Email</label>
                        <input v-model="email" type="email" class="form-control" id="email" required />
                    </div>

                    <div class="col-md-12 mb-3">
                        <label for="password" class="form-label text-purple">Пароль</label>
                        <input v-model="password" type="password" class="form-control" id="password" required />
                    </div>

                    <div class="col-md-12 mb-3">
                        <label for="password_confirmation" class="form-label text-purple">Подтвердите пароль</label>
                        <input v-model="password_confirmation" type="password" class="form-control"
                            id="password_confirmation" required />
                    </div>
                </div>

                <button type="submit" class="btn btn-purple w-100 mb-3">Зарегистрироваться</button>
            </form>

            <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
            </div>

            <div class="text-center text-muted small">
                <RouterLink to="/login" class="text-decoration-none">Уже есть аккаунт? Войти</RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import backgroundImage from '@/assets/gradient-minimalist-background_23-2149989181.avif';

const firstName = ref('');
const lastName = ref('');
const middleName = ref('');
const phone = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');
const errorMessage = ref('');
const router = useRouter();
const authStore = useAuthStore();
const backendUrl = import.meta.env.VITE_APP_BACKEND;

async function submitRegistration() {
    try {
        const response = await fetch(`${backendUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: firstName.value,
                surname: lastName.value,
                patronymic: middleName.value,
                phone: phone.value,
                email: email.value,
                password: password.value,
                password_confirmation: password_confirmation.value
            }),
            mode: 'cors'
        });

        const result = await response.json();

        if (!response.ok) {
            errorMessage.value = result.message || 'Ошибка регистрации. Проверьте данные.';
            return;
        }

        authStore.setToken(result.token);
        authStore.changeAuthStatus();
        authStore.saveToSessionStorage();
        router.push({ name: 'home' });
    } catch (error) {
        errorMessage.value = 'Ошибка соединения';
        console.error(error);
    }
}
</script>

<style scoped>
.bg-image {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

/* Сиреневый стиль */
.text-purple {
    color: #6f42c1;
}

.btn-purple {
    background-color: #6f42c1;
    border-color: #6f42c1;
    color: white;
}

.btn-purple:hover {
    background-color: #5a34a0;
    border-color: #5a34a0;
}
</style>
  
