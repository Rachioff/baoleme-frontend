import type { UserConmment } from '@/types/user'

export interface Comment  {
  id: string
  order: string
  rating: number 
  content: string
  user: UserConmment
  createdAt: string
}