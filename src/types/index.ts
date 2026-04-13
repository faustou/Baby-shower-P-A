export interface Confirmation {
  id: string
  created_at: string
  name: string
  guests_count: number
  message: string | null
}

export interface Gift {
  id: string
  name: string
  description: string | null
  price: number | null
  type: 'choose' | 'contribute'
  product_url: string | null
  image_url: string | null
  is_chosen: boolean
  chosen_by: string | null
  contributed_amount: number
  target_amount: number | null
  display_order: number
}

export interface Contribution {
  id: string
  created_at: string
  gift_id: string
  contributor_name: string | null
  amount: number
  note: string | null
}
