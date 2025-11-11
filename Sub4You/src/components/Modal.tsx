import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  title?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export const Modal = ({ isOpen, title, onClose, children, footer }: ModalProps) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', onKeyDown)
    }
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">
          ×
        </button>
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
