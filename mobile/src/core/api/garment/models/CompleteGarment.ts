export interface CompleteGarment {
  id: string
  name: string
  description: string | null
  imageUrl: string
  createdAt: string
  updatedAt: string
  brand: Brand | null
  style: Style | null
  category: Category | null
  colors: Color[] | null
}

export interface Brand {
  id: string
  name: string
}

export interface Style {
  id: string
  name: string
  description: string | null
}

export interface Category {
  id: string
  name: string
  description: string | null
}

export interface Color {
  id: string
  name: string
  hexCode: string
}
