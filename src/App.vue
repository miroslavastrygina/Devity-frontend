<script setup>
import { RouterView } from 'vue-router';
import { onMounted, watch } from 'vue';
import AchievementToastStack from '@/components/AchievementToastStack.vue';
import { useAuthStore } from '@/stores/auth';
import { useAchievementsStore } from '@/stores/achievements';

const auth = useAuthStore();
const achievements = useAchievementsStore();

onMounted(async () => {
  if (auth.isAuthenticated && auth.token) {
    if (!auth.user) {
      await auth.fetchCurrentUser();
    }

    await achievements.fetchAchievements(auth.token);
    achievements.connectRealtime(auth);
  }
});

watch(
  () => auth.isAuthenticated,
  async (isAuthenticated) => {
    if (!isAuthenticated) {
      achievements.reset();
      return;
    }

    if (!auth.user) {
      await auth.fetchCurrentUser();
    }

    await achievements.fetchAchievements(auth.token);
    achievements.connectRealtime(auth);
  },
);
</script>

<template>
  <RouterView />
  <AchievementToastStack />
</template>

<style scoped></style>
