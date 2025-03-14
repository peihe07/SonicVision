<template>
  <div class="notification-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      offset-y
      max-width="400"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
          class="notification-btn"
        >
          <v-badge
            :content="store.getUnreadCount"
            :value="store.getUnreadCount"
            color="error"
            overlap
          >
            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>通知中心</span>
          <div>
            <v-btn
              text
              small
              color="primary"
              @click="markAllAsRead"
              :disabled="!hasUnread"
            >
              全部標記已讀
            </v-btn>
            <v-btn
              text
              small
              color="error"
              @click="clearAll"
              :disabled="!hasNotifications"
            >
              清空通知
            </v-btn>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <!-- 載入中狀態 -->
        <v-card-text v-if="store.isLoading" class="text-center py-5">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-card-text>

        <!-- 錯誤提示 -->
        <v-alert
          v-if="store.getError"
          type="error"
          text
          class="ma-3"
        >
          {{ store.getError }}
        </v-alert>

        <!-- 空通知提示 -->
        <v-card-text v-if="!store.isLoading && !hasNotifications" class="text-center py-5">
          <v-icon size="64" color="grey lighten-1">mdi-bell-off</v-icon>
          <div class="mt-2 grey--text">暫無通知</div>
        </v-card-text>

        <!-- 通知列表 -->
        <v-list v-if="hasNotifications" three-line>
          <v-list-item
            v-for="notification in store.getNotifications"
            :key="notification.id"
            :class="{ 'unread': !notification.isRead }"
            @click="handleNotificationClick(notification)"
          >
            <v-list-item-avatar v-if="notification.sender">
              <v-img :src="notification.sender.avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-avatar v-else>
              <v-icon :color="getNotificationColor(notification.type)">
                {{ getNotificationIcon(notification.type) }}
              </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ notification.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ notification.message }}</v-list-item-subtitle>
              <v-list-item-subtitle class="text-caption">
                {{ formatDate(notification.createdAt) }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                icon
                x-small
                @click.stop="deleteNotification(notification.id)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { useNotificationStore } from '@/store/modules/notification';
import type { Notification } from '@/types/notification';
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'NotificationCenter',

  setup() {
    const store = useNotificationStore();
    const router = useRouter();
    const menu = ref(false);

    const hasNotifications = computed(() => store.getNotifications.length > 0);
    const hasUnread = computed(() => store.getUnreadCount > 0);

    const formatDate = (date: Date) => {
      return new Date(date).toLocaleString('zh-TW');
    };

    const getNotificationColor = (type: string): string => {
      switch (type) {
        case 'like':
          return 'red';
        case 'comment':
          return 'green';
        case 'follow':
          return 'blue';
        case 'system':
          return 'grey';
        default:
          return 'primary';
      }
    };

    const getNotificationIcon = (type: string): string => {
      switch (type) {
        case 'like':
          return 'mdi-heart';
        case 'comment':
          return 'mdi-comment';
        case 'follow':
          return 'mdi-account-plus';
        case 'system':
          return 'mdi-information';
        default:
          return 'mdi-bell';
      }
    };

    const handleNotificationClick = async (notification: Notification) => {
      if (!notification.isRead) {
        await store.markAsRead(notification.id);
      }
      if (notification.link) {
        menu.value = false;
        router.push(notification.link);
      }
    };

    const markAllAsRead = async () => {
      await store.markAllAsRead();
    };

    const deleteNotification = async (id: number) => {
      await store.deleteNotification(id);
    };

    const clearAll = async () => {
      await store.clearAllNotifications();
    };

    onMounted(async () => {
      await store.fetchNotifications();
    });

    return {
      store,
      menu,
      hasNotifications,
      hasUnread,
      formatDate,
      getNotificationColor,
      getNotificationIcon,
      handleNotificationClick,
      markAllAsRead,
      deleteNotification,
      clearAll,
    };
  },
});
</script>

<style scoped>
.notification-center {
  display: inline-block;
}

.unread {
  background-color: #f5f5f5;
}

.notification-btn {
  position: relative;
}
</style> 