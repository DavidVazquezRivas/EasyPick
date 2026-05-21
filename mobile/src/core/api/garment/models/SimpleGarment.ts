export interface Color {
  id: string
  name: string
  hexCode: string
}

export interface Style {
  id: string
  name: string
}

export interface Category {
  id: string
  name: string
}

export interface SimpleGarment {
  id: string
  name: string
  description: string | null
  imageUrl: string
  colors?: Color[] | null
  style?: Style | null
  category?: Category | null
  createdAt: string
  updatedAt: string
}
