import { useContext } from 'react'
import { SavedContext } from '../context/SavedContext'

export function useSavedItems() {
  const context = useContext(SavedContext)
  if (!context) throw new Error('useSavedItems must be used inside SavedProvider')
  return context
}
