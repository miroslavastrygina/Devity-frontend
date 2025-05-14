<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <router-link :to="`/`" class="navbar-brand">
                Онлайн-платформа Devity
            </router-link>
            <div class="d-flex ms-auto">
                <router-link :to="`/profile`" class="navbar-text">
                    👤 {{ auth.user?.name || 'Гость' }}
                </router-link>
            </div>
        </div>
    </nav>
</template>
<script setup>
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
</script>