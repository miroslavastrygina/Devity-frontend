import { defineStore } from 'pinia';

const DEFAULT_DURATION = 5000;

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    toasts: [],
  }),
  actions: {
    showAchievementToast(achievement) {
      const id = crypto.randomUUID();
      const toast = {
        id,
        type: 'achievement',
        title: achievement.title,
        description: achievement.description,
        points: achievement.points,
        icon: achievement.icon,
      };

      this.toasts.push(toast);

      setTimeout(() => {
        this.dismissToast(id);
      }, DEFAULT_DURATION);
    },
    dismissToast(id) {
      this.toasts = this.toasts.filter((toast) => toast.id !== id);
    },
  },
});
