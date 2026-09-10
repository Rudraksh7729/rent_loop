import { useContext } from 'react'
import { RentalContext } from '../context/RentalContext'

export function useRentals() {
  const context = useContext(RentalContext)
  if (!context) {
    throw new Error('useRentals must be used within RentalProvider')
  }
  return context
}
