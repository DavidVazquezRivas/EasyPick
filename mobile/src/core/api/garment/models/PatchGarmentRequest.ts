export type GarmentStatus = 'CONFIRMED' | 'PENDING' | 'DELETED'

/**
 * Partial payload for PATCH /garments/:id.
 *
 * Keep all properties optional so the same endpoint can support
 * future partial updates without changing the method signature.
 */
export interface PatchGarmentRequest {
  status?: GarmentStatus
  name?: string
  description?: string | null
  brandId?: string | null
  styleId?: string | null
  categoryId?: string | null
  colorIds?: string[] | null
}
