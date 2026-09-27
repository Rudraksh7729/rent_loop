import { createContext, useMemo, useState } from 'react'

const SAVED_STORAGE_KEY = 'rentloop_saved_items'

function loadSavedIds() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVED_STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

function persistSavedIds(ids) {
  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(ids))
    return true
  } catch {
    return false
  }
}

export const SavedContext = createContext(null)

export function SavedProvider({ children }) {
  const [savedIds, setSavedIds] = useState(() => loadSavedIds())

  const value = useMemo(() => {
    function toggleSaved(itemId) {
      if (!itemId) return { ok: false, error: 'Item not found.' }
      const next = savedIds.includes(itemId)
        ? savedIds.filter((id) => id !== itemId)
        : [itemId, ...savedIds]
      if (!persistSavedIds(next)) {
        return { ok: false, error: 'Could not update saved items in this browser.' }
      }
      setSavedIds(next)
      return { ok: true, saved: next.includes(itemId) }
    }

    function isSaved(itemId) {
      return savedIds.includes(itemId)
    }

    function getSavedIds() {
      return savedIds
    }

    return { savedIds, toggleSaved, isSaved, getSavedIds }
  }, [savedIds])

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>
}
