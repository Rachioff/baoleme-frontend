import { apiRoot } from '@/config/api'
import { useTokenStore } from '@/stores/token'
import axios from 'axios'
import type { Address } from '@/types/address'


export const getAddresses = async (): Promise<Address[]> => {
    const res = await axios.get(`${apiRoot}/addresses`, {
        headers: { Authorization: `Bearer ${useTokenStore().token}` }
    })
    return res.data as Address[]
}