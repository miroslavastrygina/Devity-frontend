import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        user: null,
        token: null,
    }),
    actions: {
        async getUserData() {
            const response = await fetch(`${backendUrl}/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Accept': 'application/json'
                },
                mode: 'cors'
            });

            if (!response.ok) {
                console.error('Ошибка получения данных пользователя');
                router.push('/login');
            } else {
                const result = await response.json();
                console.log(result);

                auth.setUserData(result);
                auth.saveToSessionStorage();
            }
        },
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
