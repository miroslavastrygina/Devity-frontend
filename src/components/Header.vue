<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <span class="navbar-brand">Онлайн-платформа Devity</span>
            <div class="d-flex ms-auto">
                <span class="navbar-text">
                    👤 {{ auth.user?.name || 'Гость' }}
                </span>
            </div>
        </div>
    </nav>
</template>
<script setup>
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
</script>