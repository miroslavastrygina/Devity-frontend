import { defineStore } from 'pinia';
import { clearEchoInstance, getEchoInstance } from '@/services/realtime';
import { useNotificationsStore } from '@/stores/notifications';

let channelName = null;

export const useAchievementsStore = defineStore('achievements', {
  state: () => ({
    items: [],
    isLoading: false,
    errorMessage: '',
    realtimeConnected: false,
  }),
  getters: {
    unlocked: (state) => state.items.filter((item) => item.is_unlocked),
    locked: (state) => state.items.filter((item) => !item.is_unlocked),
    unlockedCount: (state) => state.items.filter((item) => item.is_unlocked).length,
    totalPoints: (state) =>
      state.items.filter((item) => item.is_unlocked).reduce((sum, item) => sum + (item.points || 0), 0),
  },
  actions: {
    async fetchAchievements(token) {
      const backendUrl = import.meta.env.VITE_APP_BACKEND;

      if (!token || !backendUrl) {
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';

      try {
        const response = await fetch(`${backendUrl}/achievements`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          mode: 'cors',
        });

        if (!response.ok) {
          this.errorMessage = 'Не удалось загрузить достижения.';
          return;
        }

        const result = await response.json();
        this.items = result.data ?? [];
      } catch (error) {
        console.error('Ошибка загрузки достижений:', error);
        this.errorMessage = 'Ошибка соединения при загрузке достижений.';
      } finally {
        this.isLoading = false;
      }
    },
    applyUnlock(payload) {
      const notifications = useNotificationsStore();
      const achievementId = Number(payload.achievement_id);
      const index = this.items.findIndex((item) => Number(item.id) === achievementId);

      if (index === -1) {
        return;
      }

      if (this.items[index].is_unlocked) {
        return;
      }

      this.items[index] = {
        ...this.items[index],
        is_unlocked: true,
        awarded_at: payload.awarded_at ?? new Date().toISOString(),
      };

      notifications.showAchievementToast({
        title: payload.title ?? this.items[index].title,
        description: payload.description ?? this.items[index].description,
        points: payload.points ?? this.items[index].points,
        icon: payload.icon ?? this.items[index].icon,
      });
    },
    connectRealtime(authStore) {
      if (!authStore?.token || !authStore?.user?.id) {
        return;
      }

      const backendUrl = import.meta.env.VITE_APP_BACKEND;
      const echo = getEchoInstance(authStore.token, backendUrl);
      const publicChannel = `achievements.${authStore.user.id}`;

      if (channelName === publicChannel && this.realtimeConnected) {
        return;
      }

      if (channelName && channelName !== publicChannel) {
        echo.leave(channelName);
      }

      channelName = publicChannel;
      this.realtimeConnected = true;

      echo.channel(publicChannel).listen('.achievement.unlocked', (payload) => {
        if (payload?.achievement_id) {
          this.applyUnlock(payload);
        }
      });
    },
    reset() {
      this.items = [];
      this.errorMessage = '';
      this.isLoading = false;
      this.realtimeConnected = false;
      channelName = null;
      clearEchoInstance();
    },
  },
});
