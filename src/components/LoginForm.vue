<template>
    <div class="d-flex justify-content-center align-items-center min-vh-100 bg-image"
        :style="{ backgroundImage: `url(${backgroundImage})` }">
        <div class="card p-4 shadow-lg" style="width: 400px; border-radius: 1rem; background-color: #f9f3fc;">
            <div class="text-center mb-4">
                <h1 class="text-purple fw-bold">DEVITY</h1>
            </div>

            <h3 class="text-center mb-3 text-purple">Login</h3>

            <form @submit.prevent="submitLogin">
                <div class="mb-3">
                    <label for="email" class="form-label text-purple">Email</label>
                    <input v-model="email" type="email" class="form-control" id="email" required />
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label text-purple">Password</label>
                    <div class="input-group">
                        <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-control"
                            id="password" required />
                        <button class="btn btn-outline-secondary" type="button" @click="showPassword = !showPassword">
                            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                        </button>
                    </div>
                </div>

                <button type="submit" class="btn btn-purple w-100 mb-3" :disabled="isLoading">
                    <span v-if="!isLoading">Login</span>
                    <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                </button>
            </form>

            <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
            </div>

            <div class="text-center mt-4 text-muted small">
                <RouterLink to="/register" class="text-decoration-none">Нет аккаунта? Регистрация</RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import backgroundImage from '@/assets/gradient-minimalist-background_23-2149989181.avif'; // импорт изображения

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const showPassword = ref(false);
const isAdmin = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const backendUrl = import.meta.env.VITE_APP_BACKEND;

async function submitLogin() {
    errorMessage.value = '';

    if (!email.value || !password.value) {
        errorMessage.value = 'Please fill in all fields';
        return;
    }

    isLoading.value = true;

    try {
        const response = await fetch(`${backendUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                login: email.value,
                password: password.value,
                isAdmin: isAdmin.value
            }),
            mode: 'cors'
        });

        const result = await response.json();

        if (!response.ok) {
            errorMessage.value = result.message || 'Login error. Please check your credentials.';
            return;
        }

        authStore.setToken(result.token);
        authStore.changeAuthStatus();
        authStore.saveToSessionStorage();
        router.push({ name: 'home' });
    } catch (error) {
        errorMessage.value = 'Connection error';
        console.error('Login error:', error);
    } finally {
        isLoading.value = false;
    }
}
</script>

<style scoped>
.bg-image {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

/* Сиреневый текст */
.text-purple {
    color: #6f42c1;
}

/* Кнопки в сиреневом стиле */
.btn-outline-purple {
    border-color: #6f42c1;
    color: #6f42c1;
}

.btn-outline-purple:hover,
.btn-outline-purple.active {
    background-color: #6f42c1;
    color: white;
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

/* Адаптация под сиреневую тему */
.form-label,
.form-check-label {
    color: #6f42c1;
}
</style>
  
