<template>
    <div class="toast-container">
        <TransitionGroup name="toast">
            <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type"
                @click="removeToast(toast.id)">
                <i :class="getIcon(toast.type)"></i>
                <span>{{ toast.message }}</span>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

const getIcon = (type: string) => {
    switch (type) {
        case 'success':
            return 'fas fa-check-circle'
        case 'error':
            return 'fas fa-exclamation-circle'
        case 'warning':
            return 'fas fa-exclamation-triangle'
        default:
            return 'fas fa-info-circle'
    }
}
</script>

<style scoped>
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.toast {
    min-width: 300px;
    padding: 12px 20px;
    border-radius: 4px;
    background: white;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.toast i {
    font-size: 1.2em;
}

.toast.success {
    background-color: #4caf50;
    color: white;
}

.toast.error {
    background-color: #f44336;
    color: white;
}

.toast.warning {
    background-color: #ff9800;
    color: white;
}

.toast.info {
    background-color: #2196f3;
    color: white;
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>