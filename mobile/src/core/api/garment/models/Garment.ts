// TODO: Update fields to match the actual GET /garments/me API schema
export interface Garment {
  id: string
  name: string
  category: string
  color: string | null
  size: string | null
  imageUrl: string | null
}
