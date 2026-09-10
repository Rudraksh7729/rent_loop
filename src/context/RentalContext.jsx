import { createContext, useMemo, useState } from 'react'
import {
  createRentalId,
  loadRentals,
  normalizeRental,
  saveRentals,
} from '../data/rentalStorage'
import {
  buildItemSnapshot,
  buildUserSnapshot,
  getDisplayStatus,
  hasDateConflict,
  resolveItemOwnerId,
  validateRentalDates,
} from '../data/rentalUtils'
import { getOwnerName, getItemImage } from '../data/marketplaceUtils'

export const RentalContext = createContext(null)

export function RentalProvider({ children }) {
  const [rentals, setRentals] = useState(() => loadRentals())

  const value = useMemo(() => {
    function persist(next) {
      const saved = saveRentals(next)
      setRentals(saved)
      return saved
    }

    function getRentals() {
      return rentals
    }

    function getRentalById(id) {
      return rentals.find((rental) => rental.id === id) || null
    }

    function getRenterRentals(renterId) {
      return rentals
        .filter((rental) => rental.renterId === renterId)
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    }

    function getOwnerRentals(ownerId) {
      return rentals
        .filter((rental) => rental.ownerId === ownerId)
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    }

    function createRentalRequest({ item, renter, startDate, endDate }) {
      if (!item?.id) return { ok: false, error: 'Item not found.' }
      if (!renter?.id) return { ok: false, error: 'Please log in as a renter.' }
      if (renter.role !== 'renter') {
        return { ok: false, error: 'Only renters can request rentals.' }
      }

      const ownerId = resolveItemOwnerId(item)
      if (!ownerId) return { ok: false, error: 'This item has no owner.' }
      if (ownerId === renter.id) {
        return { ok: false, error: "You can't rent your own listing." }
      }

      if (item.status && item.status !== 'published') {
        return { ok: false, error: 'This listing is not published.' }
      }
      if (item.available === false) {
        return { ok: false, error: 'This item is currently unavailable.' }
      }

      const dateCheck = validateRentalDays(startDate, endDate)
      if (!dateCheck.ok) return dateCheck

      if (hasDateConflict(rentals, item.id, startDate, endDate)) {
        return { ok: false, error: 'These dates are no longer available.' }
      }

      const now = new Date().toISOString()
      const ownerName = getOwnerName(item.owner)
      const rental = normalizeRental({
        id: createRentalId(),
        itemId: item.id,
        renterId: renter.id,
        ownerId,
        itemSnapshot: {
          ...buildItemSnapshot(item),
          image: getItemImage(item),
        },
        renterSnapshot: buildUserSnapshot(renter),
        ownerSnapshot: {
          id: ownerId,
          name: ownerName,
          email: item.owner?.email || '',
          avatar: item.owner?.avatar || '',
        },
        startDate,
        endDate,
        durationDays: dateCheck.days,
        pricePerDay: item.pricePerDay,
        subtotal: dateCheck.days * item.pricePerDay,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      })

      if (!rental) return { ok: false, error: 'Could not create rental request.' }

      persist([rental, ...rentals])
      return { ok: true, rental }
    }

    function validateRentalDays(startDate, endDate) {
      return validateRentalDates(startDate, endDate)
    }

    function updateStatus(id, actorId, nextStatus, { asOwner = false, asRenter = false } = {}) {
      const existing = rentals.find((rental) => rental.id === id)
      if (!existing) return { ok: false, error: 'Rental not found.' }

      if (asOwner && existing.ownerId !== actorId) {
        return { ok: false, error: 'You can only manage your own rental requests.' }
      }
      if (asRenter && existing.renterId !== actorId) {
        return { ok: false, error: 'You can only manage your own rentals.' }
      }

      if (nextStatus === 'approved') {
        if (existing.status !== 'pending') {
          return { ok: false, error: 'Only pending requests can be approved.' }
        }
        if (
          hasDateConflict(
            rentals,
            existing.itemId,
            existing.startDate,
            existing.endDate,
            existing.id,
          )
        ) {
          return { ok: false, error: 'These dates are no longer available.' }
        }
      }

      if (nextStatus === 'rejected' && existing.status !== 'pending') {
        return { ok: false, error: 'Only pending requests can be rejected.' }
      }

      if (nextStatus === 'cancelled' && existing.status !== 'pending') {
        return { ok: false, error: 'Only pending requests can be cancelled.' }
      }

      if (nextStatus === 'completed') {
        const display = getDisplayStatus(existing)
        if (display !== 'active') {
          return { ok: false, error: 'Only active rentals can be completed.' }
        }
      }

      const updated = normalizeRental({
        ...existing,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      })

      persist(rentals.map((rental) => (rental.id === id ? updated : rental)))
      return { ok: true, rental: updated }
    }

    function approveRental(id, ownerId) {
      return updateStatus(id, ownerId, 'approved', { asOwner: true })
    }

    function rejectRental(id, ownerId) {
      return updateStatus(id, ownerId, 'rejected', { asOwner: true })
    }

    function cancelRental(id, renterId) {
      return updateStatus(id, renterId, 'cancelled', { asRenter: true })
    }

    function completeRental(id, ownerId) {
      return updateStatus(id, ownerId, 'completed', { asOwner: true })
    }

    function checkConflict(itemId, startDate, endDate, ignoreRentalId) {
      return hasDateConflict(rentals, itemId, startDate, endDate, ignoreRentalId)
    }

    return {
      rentals,
      getRentals,
      getRentalById,
      getRenterRentals,
      getOwnerRentals,
      createRentalRequest,
      approveRental,
      rejectRental,
      cancelRental,
      completeRental,
      checkConflict,
      getDisplayStatus,
    }
  }, [rentals])

  return <RentalContext.Provider value={value}>{children}</RentalContext.Provider>
}
