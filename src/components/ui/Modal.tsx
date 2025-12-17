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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with grid pattern */}
      <div
        className="absolute inset-0 bg-brutal-black/80 transition-opacity duration-normal"
        onClick={onClose}
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />
      
      {/* Modal content */}
      <div
        className={`
          relative bg-brutal-white w-full ${sizeStyles[size]}
          max-h-[90vh] overflow-hidden flex flex-col
          border-3 border-brutal-black
          animate-in fade-in zoom-in-95 duration-normal
        `}
        style={{
          boxShadow: '8px 8px 0px 0px #D93025',
        }}
      >
        {/* Decorative corner brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-brutal-vermillion" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-brutal-vermillion" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-brutal-vermillion" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-brutal-vermillion" />

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-lg py-md bg-brutal-black">
            <div className="flex items-center gap-3">
              <span className="font-mono text-mono-xs text-brutal-vermillion uppercase tracking-[0.3em]">
                //
              </span>
              <h2 className="font-display text-xl text-brutal-white uppercase tracking-wide">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-brutal-vermillion hover:bg-brutal-white/10 transition-colors border border-neutral-600 hover:border-brutal-vermillion"
              aria-label="Close modal"
            >
              <X size={16} />
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
      <div className="space-y-lg">
        {/* Message */}
        <p className="font-mono text-sm text-neutral-600 leading-relaxed">{message}</p>
        
        {/* Divider */}
        <div className="border-t-2 border-dashed border-neutral-200" />
        
        {/* Actions */}
        <div className="flex gap-md justify-end">
          <button
            onClick={onClose}
            className="
              px-6 py-3 font-mono text-[11px] uppercase tracking-widest
              bg-brutal-white text-brutal-black border-3 border-brutal-black
              hover:bg-brutal-black hover:text-brutal-white
              transition-all duration-fast
              hover:translate-x-[2px] hover:translate-y-[2px]
            "
            style={{
              boxShadow: '4px 4px 0px 0px #0A0A0A',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '2px 2px 0px 0px #0A0A0A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '4px 4px 0px 0px #0A0A0A';
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`
              px-6 py-3 font-mono text-[11px] uppercase tracking-widest
              border-3 border-brutal-black
              transition-all duration-fast
              hover:translate-x-[2px] hover:translate-y-[2px]
              ${variant === 'danger' 
                ? 'bg-brutal-vermillion text-brutal-white' 
                : 'bg-brutal-black text-brutal-white'
              }
            `}
            style={{
              boxShadow: variant === 'danger' 
                ? '4px 4px 0px 0px #0A0A0A' 
                : '4px 4px 0px 0px #D93025',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = variant === 'danger'
                ? '2px 2px 0px 0px #0A0A0A'
                : '2px 2px 0px 0px #D93025';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = variant === 'danger'
                ? '4px 4px 0px 0px #0A0A0A'
                : '4px 4px 0px 0px #D93025';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

