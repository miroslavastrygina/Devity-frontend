<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const auth = useAuthStore();
const router = useRouter();

onMounted(() => {
    if (!auth.isAuthenticated) {
        router.push('/login');
    }
});
</script>

<template>
    <div>Добро пожаловать!</div>
</template>
