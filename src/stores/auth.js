import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        user: null,
        token: null,
    }),
    actions: {
        async fetchCurrentUser() {
            if (!this.token) {
                return null;
            }

            const backendUrl = import.meta.env.VITE_APP_BACKEND;
            const response = await fetch(`${backendUrl}/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/json'
                },
                mode: 'cors'
            });

            if (!response.ok) {
                console.error('Ошибка получения данных пользователя');
                return null;
            }

            const user = await response.json();
            this.setUserData(user);
            this.saveToSessionStorage();
            return user;
        },
        changeAuthStatus() {
            this.isAuthenticated = true;
        },
        clearAuth() {
            this.isAuthenticated = false;
            this.user = null;
            this.token = null;
            sessionStorage.removeItem('auth');
        },
        setToken(token) {
            this.token = token
        },
        saveToSessionStorage() {
            sessionStorage.setItem('auth', JSON.stringify(this.$state));
        },
        restoreFromSessionStorage() {
            const data = sessionStorage.getItem('auth');
            if (data) {
                this.$patch(JSON.parse(data));
            }
        },
        setUserData(user) {
            this.user = user;
        }
    },
    getters: {
        getUser: (state) => state.user,
    },
});
