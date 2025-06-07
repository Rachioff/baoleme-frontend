import type { UserComment } from '@/types/user'

export interface Comment  {
  id: string
  order: string
  rating: number 
  content: string
  user: UserComment
  createdAt: string
}