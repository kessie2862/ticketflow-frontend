import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

interface ResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}

export const ResolutionModal = ({
  isOpen,
  onClose,
  onSubmit,
}: ResolutionModalProps) => {
  const [note, setNote] = useState('');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
            }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      background: 'rgba(52,211,153,0.1)',
                      border: '1px solid rgba(52,211,153,0.2)',
                    }}
                  >
                    <CheckCircle2
                      className="w-5 h-5"
                      style={{ color: '#34d399' }}
                    />
                  </div>
                  <div>
                    <h2
                      className="font-display text-xl tracking-wider"
                      style={{ color: 'var(--text)' }}
                    >
                      CLOSE TICKET
                    </h2>
                    <p
                      className="font-mono text-[10px] tracking-widest uppercase mt-0.5"
                      style={{ color: 'var(--muted)' }}
                    >
                      Document the resolution
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--muted)' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = 'var(--text)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'var(--muted)')
                  }
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Textarea */}
              <div className="mb-6">
                <label
                  className="block font-mono text-[10px] tracking-[0.2em] uppercase mb-2"
                  style={{ color: 'var(--muted)' }}
                >
                  Resolution Notes
                </label>
                <textarea
                  className="w-full p-3 rounded-xl resize-none font-body text-sm outline-none transition-all"
                  style={{
                    background: '#0a0a0f',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = 'rgba(198,241,53,0.4)')
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = 'var(--border)')
                  }
                  rows={4}
                  placeholder="Describe how this issue was resolved..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 font-mono text-xs tracking-widest uppercase rounded-full transition-colors"
                  style={{
                    color: 'var(--muted)',
                    border: '1px solid var(--border)',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => onSubmit(note)}
                  disabled={!note.trim()}
                  className="flex-1 px-4 py-2.5 font-mono text-xs tracking-widest uppercase rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: '#34d399',
                    color: '#0a0a0f',
                    boxShadow: note.trim()
                      ? '0 4px 20px rgba(52,211,153,0.25)'
                      : 'none',
                  }}
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
