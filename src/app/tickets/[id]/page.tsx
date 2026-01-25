'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useTickets } from '@/hooks/useTickets';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import {
  Loader2,
  ArrowLeft,
  Send,
  Paperclip,
  User,
  AlertTriangle,
  Edit2,
  Save,
  X,
  CheckCircle2,
  Trash2,
  Upload,
  Image as ImageIcon,
  ZoomIn,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import NextImage from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function TicketDetails() {
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const id = parseInt(params.id as string);
  const { data: session } = useSession();

  // Custom Hooks
  const {
    useGetTicket,
    useGetAssignees,
    useUpdateTicket,
    useDeleteTicket,
    useAddComment,
  } = useTickets();

  const { data: ticket, isLoading: ticketLoading } = useGetTicket(id);
  const { data: assignees, isLoading: assigneesLoading } = useGetAssignees();

  // Mutations
  const { mutate: updateTicket } = useUpdateTicket();
  const { mutate: deleteTicket, isPending: isDeleting } = useDeleteTicket();
  const { mutate: addComment } = useAddComment(id);

  // --- UI States ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    priority: 'LOW',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [shouldRemoveAttachment, setShouldRemoveAttachment] = useState(false);

  // Permissions logic
  const isOwner =
    session?.user?.id && ticket?.requester === Number(session.user.id);
  const canAssign =
    session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPPORT';

  // Sync edit form with ticket data when entering Edit Mode
  useEffect(() => {
    if (ticket && isEditing) {
      setEditForm({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
      });
      setPreviewUrl(ticket.attachment_url || null);
      setShouldRemoveAttachment(false);
      setSelectedFile(null);
    }
  }, [ticket, isEditing]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsImageModalOpen(false);
      }
    };

    if (isImageModalOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isImageModalOpen]);

  // --- Handlers ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShouldRemoveAttachment(false);
    }
  };

  const handleRemoveCurrentAttachment = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setShouldRemoveAttachment(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveTicket = () => {
    if (!editForm.title.trim() || !editForm.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', editForm.title);
    formData.append('description', editForm.description);
    formData.append('priority', editForm.priority);

    if (selectedFile) {
      formData.append('attachment', selectedFile);
    } else if (shouldRemoveAttachment) {
      // Sending empty value tells the backend to clear the field
      formData.append('attachment', '');
    }

    updateTicket(
      { id, data: formData },
      {
        onSuccess: () => {
          setIsEditing(false);
          setSelectedFile(null);
        },
      },
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmittingComment(true);
    addComment(commentText, {
      onSuccess: () => {
        setCommentText('');
        setIsSubmittingComment(false);
      },
      onError: () => setIsSubmittingComment(false),
    });
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value ? parseInt(e.target.value) : null;
    updateTicket({ id, data: { assignee: val } });
  };

  if (ticketLoading || assigneesLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <>
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() =>
            deleteTicket(id, { onSuccess: () => router.push('/dashboard') })
          }
          isDeleting={isDeleting}
          ticketTitle={ticket.title}
        />

        <div className="max-w-6xl mx-auto">
          {/* Top Header */}
          <div className="flex justify-between items-center mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>

            {isOwner && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                    <button
                      onClick={handleSaveTicket}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                    {!ticket.resolved_at && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit Ticket
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Main Content (Left) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-mono text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                    #{ticket.ticket_id}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Created {format(new Date(ticket.created_at), 'PPP')}
                  </span>
                </div>

                {/* Title & Description Fields */}
                <div className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">
                          Ticket Title
                        </label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          className="w-full text-2xl font-bold text-slate-900 border-b-2 border-indigo-50 focus:border-indigo-500 outline-none py-1 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">
                          Description
                        </label>
                        <textarea
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: e.target.value,
                            })
                          }
                          rows={6}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        {ticket.title}
                      </h1>
                      <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-lg">
                        {ticket.description}
                      </p>
                    </>
                  )}
                </div>

                {/* Attachment Section */}
                <div className="mt-10 pt-10 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-indigo-500" /> Ticket
                    Attachment
                  </h3>

                  {isEditing ? (
                    <div className="space-y-4">
                      {previewUrl ? (
                        <div className="relative inline-block group">
                          <div className="relative h-56 w-56 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-inner cursor-pointer">
                            <NextImage
                              src={previewUrl}
                              alt="Preview"
                              fill
                              className="object-cover"
                              onClick={() => setIsImageModalOpen(true)}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ZoomIn className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          <button
                            onClick={handleRemoveCurrentAttachment}
                            className="absolute -top-3 -right-3 p-2 bg-rose-600 text-white rounded-full shadow-xl hover:bg-rose-700 transition-transform hover:scale-110 active:scale-90"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="h-48 w-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 cursor-pointer transition-all group"
                        >
                          <Upload className="w-8 h-8 mb-2 group-hover:animate-bounce" />
                          <span className="text-sm font-bold">
                            Upload new image
                          </span>
                          <span className="text-xs mt-1">
                            PNG, JPG up to 5MB
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                  ) : ticket.attachment_url ? (
                    <div
                      className="relative h-80 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm cursor-pointer group"
                      onClick={() => setIsImageModalOpen(true)}
                    >
                      <NextImage
                        src={ticket.attachment_url}
                        alt="Ticket attachment"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ZoomIn className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-400 text-sm">
                      <ImageIcon className="w-5 h-5 opacity-50" />
                      No attachment provided
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Stream / Comments */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
                <h3 className="text-lg font-bold text-slate-900 mb-8">
                  Activity Stream
                </h3>

                <div className="space-y-8 mb-8">
                  {ticket.comments?.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0 shadow-sm">
                        {comment.author_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-sm font-bold text-slate-900">
                            {comment.author_name}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            {format(
                              new Date(comment.created_at),
                              'MMM d, h:mm a',
                            )}
                          </span>
                        </div>
                        <div className="bg-slate-50/80 rounded-2xl rounded-tl-none p-4 text-slate-700 text-sm leading-relaxed border border-slate-100/50">
                          {comment.text}
                        </div>
                      </div>
                    </div>
                  ))}

                  {ticket.comments?.length === 0 && (
                    <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-slate-400 text-sm font-medium">
                        No comments yet. Start the conversation!
                      </p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAddComment} className="relative group">
                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 p-5 pr-14 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none text-sm shadow-inner"
                    rows={3}
                    placeholder="Leave a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !commentText.trim()}
                    className="absolute bottom-4 right-4 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
                  >
                    {isSubmittingComment ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar (Right) */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 sticky top-8">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 border-b border-slate-50 pb-3">
                  Ticket Details
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">
                      Status
                    </label>
                    <div
                      className={`
                      inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black tracking-wide border
                      ${ticket.status === 'OPEN' ? 'bg-blue-50 text-blue-700 border-blue-100' : ''}
                      ${ticket.status === 'IN_PROGRESS' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : ''}
                      ${ticket.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : ''}
                    `}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          ticket.status === 'OPEN'
                            ? 'bg-blue-500'
                            : ticket.status === 'IN_PROGRESS'
                              ? 'bg-indigo-500'
                              : 'bg-emerald-500'
                        }`}
                      />
                      {ticket.status.replace('_', ' ')}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">
                      Priority
                    </label>
                    {isEditing ? (
                      <select
                        value={editForm.priority}
                        onChange={(e) =>
                          setEditForm({ ...editForm, priority: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertTriangle
                          className={`w-4 h-4 ${ticket.priority === 'HIGH' ? 'text-rose-500' : 'text-slate-400'}`}
                        />
                        <span className="text-sm font-bold text-slate-700">
                          {ticket.priority}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">
                      Assignee
                    </label>
                    {canAssign ? (
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={ticket.assignee || ''}
                        onChange={handleAssigneeChange}
                      >
                        <option value="">Unassigned</option>
                        {assignees?.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.username}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-slate-700 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <User className="w-4 h-4 text-slate-400" />
                        {ticket.assignee_name || 'Unassigned'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">
                      Requester
                    </label>
                    <div className="flex items-center gap-2 text-sm text-slate-700 font-bold">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] border border-slate-200">
                        {ticket.requester_name?.charAt(0)}
                      </div>
                      {ticket.requester_name}
                    </div>
                  </div>
                </div>

                {ticket.resolution_notes && (
                  <div className="mt-8 pt-6 border-t border-slate-50">
                    <h4 className="text-[10px] font-bold text-emerald-600 uppercase mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolution
                    </h4>
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-800 leading-relaxed italic">
                      &quot;{ticket.resolution_notes}&quot;
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && ticket.attachment_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative max-w-[95vw] max-h-[95vh] w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white text-3xl font-bold transition-colors backdrop-blur-sm z-10"
                onClick={() => setIsImageModalOpen(false)}
              >
                ×
              </button>

              {/* Image */}
              <div className="relative w-full h-full">
                <NextImage
                  src={ticket.attachment_url}
                  alt="Full attachment view"
                  fill
                  className="object-contain"
                  quality={100}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
