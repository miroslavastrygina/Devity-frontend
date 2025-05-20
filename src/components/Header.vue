<template>
    <nav class="navbar navbar-expand-lg shadow-sm" style="background-color: #f9f3fc;">
      <div class="container-fluid">
        <!-- Логотип и название -->
        <router-link :to="`/`" class="navbar-brand d-flex align-items-center gap-2 text-purple fs-4 fw-bold">
          <img src="@/assets/logo.svg" alt="logo" height="32" />
          Devity
        </router-link>
  
        <!-- Правый блок -->
        <div class="d-flex ms-auto align-items-center gap-3">
          <span class="text-muted small">Онлайн-платформа</span>
          <router-link :to="`/profile`" class="text-purple text-decoration-none fw-medium">
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
  
  <style scoped>
  .text-purple {
    color: #6f42c1;
  }
  
  .text-purple:hover {
    color: #5a34a0;
  }
  </style>
  