<template>
  <div class="toast-stack">
    <TransitionGroup name="toast-pop" tag="div" class="d-flex flex-column gap-3">
      <article v-for="toast in notifications.toasts" :key="toast.id" class="achievement-toast shadow-lg">
        <div class="d-flex align-items-start gap-3">
          <div class="toast-icon">🏆</div>
          <div>
            <p class="toast-caption mb-1">Новое достижение</p>
            <h6 class="toast-title mb-1">{{ toast.title }}</h6>
            <p class="toast-description mb-2">{{ toast.description }}</p>
            <span class="toast-points">+{{ toast.points }} очков</span>
          </div>
          <button class="btn-close btn-close-white ms-auto" @click="notifications.dismissToast(toast.id)" />
        </div>
      </article>
    </TransitionGroup>
    <audio ref="audioRef" preload="auto" />
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';
import { useNotificationsStore } from '@/stores/notifications';

const notifications = useNotificationsStore();
const audioRef = ref(null);

function playChime() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;

  if (!AudioCtx) {
    return;
  }

  const audioContext = new AudioCtx();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(740, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(988, audioContext.currentTime + 0.18);

  gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.26);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.28);
}

watch(
  () => notifications.toasts.length,
  async (next, prev) => {
    if (next <= prev) {
      return;
    }

    await nextTick();
    playChime();
  },
);
</script>

<style scoped>
.toast-stack {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 2000;
  width: min(360px, calc(100vw - 2rem));
  pointer-events: none;
}

.achievement-toast {
  pointer-events: auto;
  border-radius: 16px;
  padding: 1rem;
  background: linear-gradient(130deg, #6f42c1, #8f67db);
  color: #fff;
  border: 1px solid rgb(255 255 255 / 0.2);
  backdrop-filter: blur(8px);
}

.toast-icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background-color: rgb(255 255 255 / 0.18);
  font-size: 1.2rem;
}

.toast-caption {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.85;
}

.toast-title {
  font-weight: 700;
}

.toast-description {
  font-size: 0.9rem;
  opacity: 0.92;
}

.toast-points {
  display: inline-block;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.22);
  font-size: 0.8rem;
  font-weight: 600;
}

.toast-pop-enter-active,
.toast-pop-leave-active {
  transition: all 0.35s ease;
}

.toast-pop-enter-from,
.toast-pop-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}
</style>
