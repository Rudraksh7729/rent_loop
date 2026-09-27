import test from 'node:test'
import assert from 'node:assert/strict'
import {
  datesOverlap,
  filterRentalsByTab,
  getDisplayStatus,
  validateRentalDates,
} from '../src/data/rentalUtils.js'

test('accepts a valid one-day rental', () => {
  assert.deepEqual(
    validateRentalDates('2026-09-28', '2026-09-28', '2026-09-28'),
    { ok: true, days: 1 },
  )
})

test('rejects rental dates in the past', () => {
  const result = validateRentalDates('2026-09-27', '2026-09-28', '2026-09-28')
  assert.equal(result.ok, false)
  assert.match(result.error, /past/i)
})

test('rejects an end date before the start date', () => {
  const result = validateRentalDates('2026-09-30', '2026-09-29', '2026-09-28')
  assert.equal(result.ok, false)
  assert.match(result.error, /on or after/i)
})

test('detects inclusive date overlap', () => {
  assert.equal(datesOverlap('2026-10-01', '2026-10-03', '2026-10-03', '2026-10-05'), true)
  assert.equal(datesOverlap('2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'), false)
})

test('derives lifecycle status from approved rental dates', () => {
  const rental = { status: 'approved', startDate: '2026-10-01', endDate: '2026-10-03' }
  assert.equal(getDisplayStatus(rental, '2026-09-30'), 'approved')
  assert.equal(getDisplayStatus(rental, '2026-10-01'), 'active')
  assert.equal(getDisplayStatus(rental, '2026-10-04'), 'completed')
})

test('filters rental tabs using display status', () => {
  const rentals = [
    { id: '1', status: 'pending', startDate: '2026-10-01', endDate: '2026-10-02' },
    { id: '2', status: 'approved', startDate: '2026-10-01', endDate: '2026-10-02' },
    { id: '3', status: 'rejected', startDate: '2026-10-01', endDate: '2026-10-02' },
  ]
  assert.equal(filterRentalsByTab(rentals, 'pending', '2026-09-28').length, 1)
  assert.equal(filterRentalsByTab(rentals, 'upcoming', '2026-09-28').length, 1)
  assert.equal(filterRentalsByTab(rentals, 'closed', '2026-09-28').length, 1)
})
