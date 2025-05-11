import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

import { useAuthStore } from '@/stores/auth';
import { useDataStore } from '@/stores/data';

const authStore = useAuthStore();
const dataStore = useDataStore();

authStore.restoreFromSessionStorage();
dataStore.restoreFromSessionStorage();

app.mount('#app')
