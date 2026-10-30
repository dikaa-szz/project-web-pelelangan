export interface User {
  id: number
  name: string
  email: string
  phone?: string
  role: 'admin' | 'seller' | 'buyer'
  status: 'pending' | 'active' | 'suspended'
  kyc_verified_at?: string | null
  deposit_balance: number
  seller_profile?: SellerProfile | null
  created_at: string
}

export interface SellerProfile {
  id: number
  user_id: number
  company_name?: string
  address?: string
  city?: string
  province?: string
  bank_name?: string
  bank_account_number?: string
  bank_account_holder?: string
  rating: number
}

export interface VehicleImage {
  id: number
  vehicle_id: number
  image_url: string
  is_primary: boolean
  caption?: string
  order: number
}

export interface VehicleInspection {
  id: number
  vehicle_id: number
  inspector_name: string
  inspection_date: string
  overall_score: number
  engine_condition: string
  transmission_condition: string
  brake_system: string
  electrical_system: string
  body_frame: string
  interior_condition: string
  exterior_paint: string
  accident_history: boolean
  flood_history: boolean
  notes?: string
  report_pdf_url?: string
}

export interface Vehicle {
  id: number
  seller_id: number
  title: string
  brand: string
  model: string
  year: number
  transmission: 'manual' | 'automatic'
  fuel_type: 'bensin' | 'diesel' | 'hybrid' | 'listrik'
  mileage: number
  color: string
  license_plate: string
  vin?: string
  engine_number?: string
  bpkb_number?: string
  stnk_valid_until?: string
  description?: string
  condition_grade: 'A' | 'B' | 'C' | 'D'
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'in_auction' | 'sold'
  primary_image?: VehicleImage | null
  images?: VehicleImage[]
  inspection?: VehicleInspection | null
  seller?: User
  latest_auction?: Auction | null
}

export interface Bid {
  id: number
  auction_id: number
  user_id: number
  amount: number
  is_winning: boolean
  created_at: string
  user?: {
    id: number
    name: string
  }
}

export interface Auction {
  id: number
  vehicle_id: number
  title: string
  start_price: number
  bid_increment: number
  reserve_price?: number | null
  current_price: number
  current_winner_id?: number | null
  current_winner?: User | null
  total_bids: number
  start_time: string
  end_time: string
  auto_extension_threshold: number
  auto_extension_duration: number
  max_extensions: number
  extensions_used: number
  status: 'scheduled' | 'live' | 'extended' | 'ended' | 'finalized' | 'cancelled'
  vehicle?: Vehicle
  bids?: Bid[]
  result?: AuctionResult | null
}

export interface AuctionResult {
  id: number
  auction_id: number
  winner_id?: number | null
  final_price: number
  reserve_met: boolean
  status: 'pending_payment' | 'paid' | 'cancelled' | 'reserve_not_met'
  payment_due_at?: string | null
  buyer_premium: number
  seller_fee: number
  total_amount: number
  finalized_at: string
}

export interface Payment {
  id: number
  auction_result_id: number
  user_id: number
  payment_reference: string
  payment_method: string
  amount: number
  proof_of_transfer?: string | null
  status: 'pending' | 'verified' | 'rejected' | 'refunded'
  verified_at?: string | null
  notes?: string
}
