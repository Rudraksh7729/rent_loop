import Modal from '../ui/Modal'
import Button from '../ui/Button'

export default function RentalActionModal({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  onConfirm,
  tone = 'primary',
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm leading-relaxed text-ink-soft">{description}</p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Keep as is
        </Button>
        <Button
          className="flex-1"
          variant={tone === 'danger' ? 'danger' : 'primary'}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
