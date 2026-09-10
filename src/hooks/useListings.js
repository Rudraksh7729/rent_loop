import { useContext } from 'react'
import { ListingContext } from '../context/ListingContext'

export function useListings() {
  const context = useContext(ListingContext)
  if (!context) {
    throw new Error('useListings must be used within ListingProvider')
  }
  return context
}
