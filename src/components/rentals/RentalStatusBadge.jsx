import { getDisplayLabel } from '../../data/rentalUtils'

const statusClass = {
  pending: 'status-pending',
  approved: 'status-approved',
  active: 'status-active',
  completed: 'status-completed',
  rejected: 'status-rejected',
  cancelled: 'status-cancelled',
}

export default function RentalStatusBadge({ status }) {
  return (
    <span className={`status-badge ${statusClass[status] || statusClass.pending}`}>
      {getDisplayLabel(status)}
    </span>
  )
}
