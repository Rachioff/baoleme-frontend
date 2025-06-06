import { getUser } from "@/api/user"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useTokenStore = defineStore('token', () => {
    const token = ref<string | null>(null)
    const userId = ref<string | null>(null)
    const admin = ref<boolean>(false)
    
    async function setToken(newToken: string, newUserId: string) {
        token.value = newToken
        userId.value = newUserId
        try {
            admin.value = (await getUser(newUserId)).role === 'admin'
        } catch (e) {
            console.error('Failed to get user info', e)
            admin.value = false
        }
    }
    
    function clearToken() {
        token.value = null
        userId.value = null
        admin.value = false
    }
    
    return { token, userId, admin, setToken, clearToken }
}, {
    persist: {
        storage: localStorage,
        pick: ['token', 'userId'],
    },
})