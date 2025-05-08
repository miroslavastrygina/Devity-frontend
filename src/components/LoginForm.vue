<template>
    <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div class="card p-4 shadow" style="width: 400px; background-color: #f8f9fa; border-radius: 1rem;">
            <h2 class="text-center mb-4">Devity</h2>
            <form @submit.prevent="submitLogin">
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input v-model="email" type="email" class="form-control" id="email" required />
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Пароль</label>
                    <input v-model="password" type="password" class="form-control" id="password" required />
                </div>

                <button type="submit" class="btn btn-success w-100 mb-3">Войти</button>
            </form>

            <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
            </div>

            <div class="text-center">
                <RouterLink to="/register" class="text-decoration-none">Нет аккаунта? Зарегистрироваться</RouterLink>
            </div>


        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const email = ref(''); // храним email
const password = ref(''); // храним пароль
const errorMessage = ref('');
const router = useRouter();
const authStore = useAuthStore();
const backendUrl = import.meta.env.VITE_APP_BACKEND;

async function submitLogin() {
    errorMessage.value = '';

    const response = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            login: email.value,
            password: password.value,
        }),
        mode: 'cors'
    });

    const result = await response.json();

    if (!response.ok) {
        errorMessage.value = result.message || 'Ошибка входа. Проверьте свои данные.';
    } else {
        authStore.setToken(result.token)
        authStore.changeAuthStatus();
        authStore.saveToSessionStorage();
        router.push({ name: 'home' })
    }
}
</script>