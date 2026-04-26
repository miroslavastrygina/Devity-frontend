<template>
  <section class="achievements-card shadow-sm">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <div>
        <p class="text-uppercase mini-title mb-1">Достижения</p>
        <h4 class="mb-0">Прогресс в обучении</h4>
      </div>
      <div class="d-flex gap-2">
        <span class="stat-pill">Открыто: {{ achievements.unlockedCount }}/{{ achievements.items.length }}</span>
        <span class="stat-pill">Очки: {{ achievements.totalPoints }}</span>
      </div>
    </div>

    <div v-if="achievements.isLoading" class="alert alert-light border">
      Загружаем достижения...
    </div>
    <div v-else-if="achievements.errorMessage" class="alert alert-danger">
      {{ achievements.errorMessage }}
    </div>
    <div v-else class="row g-3">
      <article
        v-for="achievement in achievements.items"
        :key="achievement.id"
        class="col-12 col-md-6"
      >
        <div class="achievement-item h-100" :class="{ unlocked: achievement.is_unlocked }">
          <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
            <div class="achievement-icon">{{ achievement.is_unlocked ? '🏆' : '🔒' }}</div>
            <small class="points">{{ achievement.points }} pts</small>
          </div>

          <h6 class="mb-2">{{ achievement.title }}</h6>
          <p class="text-muted mb-3">{{ achievement.description }}</p>

          <div class="d-flex justify-content-between align-items-center">
            <span class="status" :class="achievement.is_unlocked ? 'done' : 'todo'">
              {{ achievement.is_unlocked ? 'Получено' : 'Не получено' }}
            </span>
            <small v-if="achievement.awarded_at" class="text-muted">
              {{ formatDate(achievement.awarded_at) }}
            </small>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { useAchievementsStore } from '@/stores/achievements';

const achievements = useAchievementsStore();

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
</script>

<style scoped>
.achievements-card {
  margin-top: 1.5rem;
  border-radius: 18px;
  background: #fff;
  padding: 1.35rem;
}

.mini-title {
  color: #6f42c1;
  letter-spacing: 0.04em;
  font-size: 0.73rem;
  font-weight: 700;
}

.stat-pill {
  background-color: #f0e7ff;
  color: #5d2caf;
  border-radius: 999px;
  font-size: 0.8rem;
  padding: 0.35rem 0.7rem;
  font-weight: 600;
}

.achievement-item {
  border: 1px solid #e9e0f8;
  border-radius: 14px;
  padding: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background: #faf8ff;
}

.achievement-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgb(111 66 193 / 0.12);
}

.achievement-item.unlocked {
  border-color: #6f42c1;
  background: linear-gradient(180deg, #fbf9ff, #f3ecff);
}

.achievement-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #efe6ff;
}

.points {
  color: #5f32ab;
  font-weight: 700;
}

.status {
  font-size: 0.8rem;
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
}

.status.done {
  background: #e5dbff;
  color: #5f30ac;
}

.status.todo {
  background: #ececec;
  color: #626262;
}
</style>
