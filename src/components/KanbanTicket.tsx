import Link from 'next/link';
import { Draggable } from '@hello-pangea/dnd';
import { AlertCircle, Calendar, UserCircle2 } from 'lucide-react';
import { Ticket } from '../types';

interface KanbanTicketProps {
  ticket: Ticket;
  index: number;
}

export const KanbanTicket = ({ ticket, index }: KanbanTicketProps) => {
  const priorityStyles = {
    HIGH: 'bg-rose-50 text-rose-700 border-rose-200',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
    LOW: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const priorityColor =
    priorityStyles[ticket.priority as keyof typeof priorityStyles] ||
    priorityStyles.LOW;

  return (
    <Draggable draggableId={ticket.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ ...provided.draggableProps.style }}
          className={`
            bg-white p-5 rounded-xl border border-slate-200 shadow-sm group
            transition-all duration-200 hover:shadow-md hover:border-indigo-200
            ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-indigo-500 rotate-2 scale-105 z-50' : ''}
          `}
        >
          {/* Header: ID and Priority */}
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
              #{ticket.ticket_id}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityColor}`}
            >
              {ticket.priority}
            </span>
          </div>

          {/* Title */}
          <h4 className="font-semibold text-slate-800 leading-snug mb-3 text-sm">
            <Link
              href={`/tickets/${ticket.id}`}
              className="hover:text-indigo-600 transition-colors"
            >
              {ticket.title}
            </Link>
          </h4>

          {/* SLA Warning */}
          {ticket.is_sla_breached && (
            <div className="mb-3 flex items-center gap-1.5 text-rose-600 bg-rose-50 p-2 rounded-lg text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>SLA Breached</span>
            </div>
          )}

          <div className="h-px bg-slate-100 w-full my-3" />

          {/* Footer: Assignee & Date */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <UserCircle2 className="w-4 h-4 text-slate-400" />
              <span className="font-medium truncate max-w-20">
                {ticket.assignee_name?.split(' ')[0] || 'Unassigned'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(ticket.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
