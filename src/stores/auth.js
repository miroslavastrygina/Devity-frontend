import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        user: null,
        token: null,
    }),
    actions: {
        changeAuthStatus() {
            this.isAuthenticated = true;
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
