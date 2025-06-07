import { apiRoot } from '@/config/api'
import { useTokenStore } from '@/stores/token'
import axios from 'axios'
import type { Address, AddressCreate } from '@/types/address'


export const getAddresses = async (): Promise<Address[]> => {
    const res = await axios.get(`${apiRoot}/addresses`, {
        headers: { Authorization: `Bearer ${useTokenStore().token}` }
    })
    return res.data as Address[]
}

export const addAddresses = async (data: AddressCreate): Promise<Address> => {
    const res = await axios.post(`${apiRoot}/addresses`, data, {
        headers: { Authorization: `Bearer ${useTokenStore().token}` }
    })
    return res.data as Address
}