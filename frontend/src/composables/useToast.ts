import { ref } from 'vue'

interface Toast {
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
    id: number
}

const toasts = ref<Toast[]>([])
let nextId = 1

export function useToast() {
    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000) => {
        const id = nextId++
        const toast: Toast = {
            message,
            type,
            id
        }

        toasts.value.push(toast)

        setTimeout(() => {
            const index = toasts.value.findIndex(t => t.id === id)
            if (index !== -1) {
                toasts.value.splice(index, 1)
            }
        }, duration)
    }

    const removeToast = (id: number) => {
        const index = toasts.value.findIndex(t => t.id === id)
        if (index !== -1) {
            toasts.value.splice(index, 1)
        }
    }

    return {
        toasts,
        showToast,
        removeToast
    }
} 