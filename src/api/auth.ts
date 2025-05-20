import { apiRoot } from '@/config/api'
import { useTokenStore } from '@/stores/token'
import axios from 'axios'

export const updateEmail = async (newEmail: string) => {
    await axios.post(`${apiRoot}/auth/update-email`, { newEmail }, {
        headers: { Authorization: `Bearer ${useTokenStore().token}` }
    })
}