'use client';

import { AlertTriangle, Loader2, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  ticketTitle: string;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  ticketTitle,
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div
          className="flex justify-between items-center px-6 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h3
            className="font-display text-xl tracking-wider"
            style={{ color: 'var(--text)' }}
          >
            CONFIRM DELETION
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div
            className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-5"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            <AlertTriangle className="w-7 h-7" style={{ color: '#f87171' }} />
          </div>
          <p
            className="font-body text-sm leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            Are you sure you want to delete{' '}
            <span className="font-semibold" style={{ color: 'var(--text)' }}>
              &quot;{ticketTitle}&quot;
            </span>
            ? This action is permanent and cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div
          className="flex gap-3 px-6 py-4"
          style={{
            borderTop: '1px solid var(--border)',
            background: '#0a0a0f',
          }}
        >
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 font-mono text-xs tracking-widest uppercase rounded-full transition-colors disabled:opacity-50"
            style={{
              color: 'var(--muted)',
              border: '1px solid var(--border)',
              background: 'transparent',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 font-mono text-xs tracking-widest uppercase rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            style={{
              background: '#ef4444',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(239,68,68,0.3)',
            }}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Ticket'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
