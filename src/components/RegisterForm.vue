<template>
    <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div class="card p-4" style="width: 600px; background-color: #f8f9fa; border-radius: 1rem;">
            <h2 class="text-center mb-4">Регистрация</h2>

            <form @submit.prevent="submitRegistration">
                <!-- 2 колонки для формы -->
                <div class="row">
                    <!-- Колонка 1 -->
                    <div class="col-md-6 mb-3">
                        <label for="first_name" class="form-label">Имя</label>
                        <input v-model="firstName" type="text" class="form-control" id="first_name" required />
                    </div>

                    <!-- Колонка 2 -->
                    <div class="col-md-6 mb-3">
                        <label for="last_name" class="form-label">Фамилия</label>
                        <input v-model="lastName" type="text" class="form-control" id="last_name" required />
                    </div>

                    <!-- Колонка 1 -->
                    <div class="col-md-6 mb-3">
                        <label for="middle_name" class="form-label">Отчество</label>
                        <input v-model="middleName" type="text" class="form-control" id="middle_name" required />
                    </div>

                    <!-- Колонка 2 -->
                    <div class="col-md-6 mb-3">
                        <label for="phone" class="form-label">Телефон</label>
                        <input v-model="phone" type="tel" class="form-control" id="phone" required />
                    </div>

                    <!-- Колонка 1 -->
                    <div class="col-md-12 mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input v-model="email" type="email" class="form-control" id="email" required />
                    </div>

                    <!-- Колонка 2 -->
                    <div class="col-md-12 mb-3">
                        <label for="password" class="form-label">Пароль</label>
                        <input v-model="password" type="password" class="form-control" id="password" required />
                    </div>

                    <div class="col-md-12 mb-3">
                        <label for="password_confirmation" class="form-label">Подтвердите пароль</label>
                        <input v-model="password_confirmation" type="password" class="form-control"
                            id="password_confirmation" required />
                    </div>
                </div>

                <button type="submit" class="btn btn-success w-100 mb-3">Зарегистрироваться</button>
            </form>

            <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
            </div>

            <div class="text-center">
                <RouterLink to="/login" class="text-decoration-none">Уже есть аккаунт? Войти</RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const firstName = ref('');
const lastName = ref('');
const middleName = ref('');
const phone = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');
const errorMessage = ref('');
const router = useRouter();
const backendUrl = import.meta.env.VITE_APP_BACKEND;

// Метод отправки данных на сервер через API
async function submitRegistration() {
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

    if (!response.ok) {
        const errorData = await response.json();
        errorMessage.value = errorData.message || 'Ошибка входа. Проверьте свои данные.';
    }

}
</script>

<style scoped>
/* можно добавить дополнительную стилизацию при желании */
</style>