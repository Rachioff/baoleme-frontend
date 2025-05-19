export interface UserInfo {
    id: string
    email?: string
    createdAt?: Date
}

export type UserRole = 'admin' | 'customer' | 'merchant' | 'rider'

export interface UserProfile {
    name: string
    description: string
    role: UserRole
}

export interface UserData extends UserInfo, UserProfile {
    avatar: {
        origin: string
        thumbnail: string
    }
}