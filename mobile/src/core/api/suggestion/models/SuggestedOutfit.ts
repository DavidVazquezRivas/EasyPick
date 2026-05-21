import type { CompleteGarment } from '@/core/api/garment/models/CompleteGarment'

export type SuggestedGarment = CompleteGarment & {
  score: number
}

export type SuggestedOutfit = {
  id: string
  name: string
  garments: SuggestedGarment[]
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | string
}
