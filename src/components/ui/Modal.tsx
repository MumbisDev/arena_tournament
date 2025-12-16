import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-primary-black/50 transition-opacity duration-normal"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div
        className={`
          relative bg-primary-white w-full mx-4 ${sizeStyles[size]}
          max-h-[90vh] overflow-hidden flex flex-col
          animate-in fade-in zoom-in-95 duration-normal
        `}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-lg py-md border-b border-neutral-200">
            <h2 className="text-h3 uppercase">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-primary-black transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        )}
        
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-lg">
          {children}
        </div>
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'default';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-body text-neutral-600 mb-lg">{message}</p>
      <div className="flex gap-md justify-end">
        <button
          onClick={onClose}
          className="px-6 py-3 text-xs font-medium uppercase tracking-widest border border-neutral-300 hover:border-primary-black transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={`
            px-6 py-3 text-xs font-medium uppercase tracking-widest text-primary-white transition-colors
            ${variant === 'danger' ? 'bg-semantic-error hover:bg-red-700' : 'bg-primary-black hover:bg-neutral-800'}
          `}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

