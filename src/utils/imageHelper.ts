import { Vehicle, VehicleImage } from '../types'

const DEFAULT_CAR_FALLBACK = 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80'

/**
 * Resolves a vehicle image URL from database record to a valid, displayable URL.
 */
export const getVehicleImageUrl = (
  vehicle?: Vehicle | null,
  customFallback: string = DEFAULT_CAR_FALLBACK
): string => {
  if (!vehicle) return customFallback

  // Check primary_image first, then first image in images array
  const rawUrl =
    vehicle.primary_image?.image_url ||
    (vehicle.images && vehicle.images.length > 0 ? vehicle.images[0].image_url : null)

  return formatImageUrl(rawUrl, customFallback)
}

/**
 * Formats any raw image URL string or VehicleImage object.
 */
export const formatImageUrl = (
  urlOrImage?: string | VehicleImage | null,
  fallback: string = DEFAULT_CAR_FALLBACK
): string => {
  if (!urlOrImage) return fallback

  const rawUrl = typeof urlOrImage === 'string' ? urlOrImage : urlOrImage.image_url
  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '') return fallback

  const trimmed = rawUrl.trim()

  // Full HTTP/HTTPS URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }

  // Base64 data URL
  if (trimmed.startsWith('data:image')) {
    return trimmed
  }

  // Resolve relative backend URL (e.g. /storage/... or storage/... or vehicles/...)
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
  const backendOrigin = apiBase.replace(/\/api\/?$/, '')

  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return `${backendOrigin}${cleanPath.startsWith('/storage') ? cleanPath : `/storage/${cleanPath.replace(/^\//, '')}`}`
}

/**
 * Image onError handler to replace broken images with fallback.
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = DEFAULT_CAR_FALLBACK
) => {
  const target = e.currentTarget
  if (target.src !== fallback) {
    target.src = fallback
  }
}
