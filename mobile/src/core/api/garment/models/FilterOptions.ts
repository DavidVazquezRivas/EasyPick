export interface Color {
  id: string
  name: string
  hexCode: string
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
