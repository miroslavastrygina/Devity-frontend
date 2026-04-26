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
        <router-link :to="`/assignments`" class="text-purple text-decoration-none fw-medium">
          Мои результаты
        </router-link>
        <router-link :to="`/profile`" class="text-purple text-decoration-none fw-medium">
          👤 {{ auth.user?.name || 'Гость' }}
        </router-link>
        <router-link :to="`/profile`" class="position-relative text-decoration-none">
          <span class="badge-icon">🏅</span>
          <span v-if="achievements.unlockedCount" class="badge-count">
            {{ achievements.unlockedCount }}
          </span>
        </router-link>
      </div>
    </div>
  </nav>
</template>
  
  <script setup>
  import { useAuthStore } from '@/stores/auth';
  import { useAchievementsStore } from '@/stores/achievements';
  const auth = useAuthStore();
  const achievements = useAchievementsStore();
  </script>
  
  <style scoped>
  .text-purple {
    color: #6f42c1;
  }
  
  .text-purple:hover {
    color: #5a34a0;
  }

  .badge-icon {
    display: inline-grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    border-radius: 999px;
    background: #f0e7ff;
    font-size: 1rem;
  }

  .badge-count {
    position: absolute;
    top: -0.3rem;
    right: -0.3rem;
    min-width: 1.15rem;
    height: 1.15rem;
    border-radius: 999px;
    padding: 0 0.25rem;
    background: #6f42c1;
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
    display: grid;
    place-items: center;
  }
  </style>
  