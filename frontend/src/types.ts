export type Project = {
  id: string
  name: string
  developerId: string
  location: string
  district: string
  category: string
  status: string
  description: string
  image: string
  pricePerSqm: number
  rentPerMonth: number
  sizeRange: string
  handover: string
  amenities: string[]
  priceHistory: { month: string; price: number }[]
}

export type Developer = { id: string; name: string; projects: { id: string; name: string }[] }