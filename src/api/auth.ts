import { apiRoot } from '@/config/api'
import { useTokenStore } from '@/stores/token'
import axios from 'axios'

export const updateEmail = async (newEmail: string) => {
    await axios.post(`${apiRoot}/auth/update-email`, { newEmail }, {
        headers: { Authorization: `Bearer ${useTokenStore().token}` }
    })
}

export interface VerifyRegisterRequest {
    token: string
    [property: string]: any
}

/**
 * 调用后端接口验证注册token
 * @param token JWT令牌
 */
export const verifyRegister = async (token: string) => {
    await axios.post<void>(`${apiRoot}/auth/verify-register`, { token } as VerifyRegisterRequest)
}