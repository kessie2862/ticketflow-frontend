import Link from 'next/link';
import { Draggable } from '@hello-pangea/dnd';
import { AlertCircle, Calendar, UserCircle2 } from 'lucide-react';
import { Ticket } from '../types';

interface KanbanTicketProps {
  ticket: Ticket;
  index: number;
}

export const KanbanTicket = ({ ticket, index }: KanbanTicketProps) => {
  const priorityConfig = {
    HIGH: {
      bg: 'rgba(239,68,68,0.12)',
      color: '#f87171',
      border: 'rgba(239,68,68,0.25)',
    },
    MEDIUM: {
      bg: 'rgba(251,191,36,0.12)',
      color: '#fbbf24',
      border: 'rgba(251,191,36,0.25)',
    },
    LOW: {
      bg: 'rgba(148,163,184,0.08)',
      color: '#94a3b8',
      border: 'rgba(148,163,184,0.15)',
    },
  };

  const priority =
    priorityConfig[ticket.priority as keyof typeof priorityConfig] ??
    priorityConfig.LOW;

  return (
    <Draggable draggableId={ticket.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="p-4 rounded-xl transition-all duration-200"
          style={{
            ...provided.draggableProps.style,
            background: snapshot.isDragging ? 'var(--surface-2)' : '#0f0f16',
            border: snapshot.isDragging
              ? '1px solid var(--accent)'
              : '1px solid var(--border)',
            transform: snapshot.isDragging
              ? `${provided.draggableProps.style?.transform} rotate(1.5deg)`
              : provided.draggableProps.style?.transform,
            boxShadow: snapshot.isDragging
              ? '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(198,241,53,0.3)'
              : 'none',
            zIndex: snapshot.isDragging ? 50 : 'auto',
          }}
        >
          {/* Header: ID and Priority */}
          <div className="flex justify-between items-start mb-3">
            <span
              className="font-mono text-[10px] tracking-wider px-2 py-0.5 rounded"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--muted)',
                border: '1px solid var(--border)',
              }}
            >
              #{ticket.ticket_id}
            </span>
            <span
              className="font-mono text-[10px] tracking-wider px-2 py-0.5 rounded-full"
              style={{
                background: priority.bg,
                color: priority.color,
                border: `1px solid ${priority.border}`,
              }}
            >
              {ticket.priority}
            </span>
          </div>

          {/* Title */}
          <h4 className="font-body font-semibold text-sm leading-snug mb-3">
            <Link
              href={`/tickets/${ticket.id}`}
              className="transition-colors"
              style={{ color: 'var(--text)' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = 'var(--accent)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = 'var(--text)')
              }
            >
              {ticket.title}
            </Link>
          </h4>

          {/* SLA Warning */}
          {ticket.is_sla_breached && (
            <div
              className="mb-3 flex items-center gap-1.5 p-2 rounded-lg font-mono text-[10px] tracking-wider uppercase"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#f87171',
              }}
            >
              <AlertCircle className="w-3 h-3" />
              <span>SLA Breached</span>
            </div>
          )}

          {/* Divider */}
          <div
            className="w-full my-3"
            style={{ height: '1px', background: 'var(--border)' }}
          />

          {/* Footer */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <UserCircle2
                className="w-3.5 h-3.5"
                style={{ color: 'var(--muted)' }}
              />
              <span
                className="font-body text-xs font-medium truncate max-w-20"
                style={{ color: 'var(--muted)' }}
              >
                {ticket.assignee_name?.split(' ')[0] || 'Unassigned'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" style={{ color: 'var(--muted)' }} />
              <span
                className="font-mono text-[10px]"
                style={{ color: 'var(--muted)' }}
              >
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

// // src/components/KanbanTicket.tsx

// import Link from 'next/link';
// import { Draggable } from '@hello-pangea/dnd';
// import { AlertCircle, Calendar, UserCircle2 } from 'lucide-react';
// import { Ticket } from '../types';

// interface KanbanTicketProps {
//   ticket: Ticket;
//   index: number;
// }

// export const KanbanTicket = ({ ticket, index }: KanbanTicketProps) => {
//   const priorityStyles = {
//     HIGH: 'bg-rose-50 text-rose-700 border-rose-200',
//     MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
//     LOW: 'bg-slate-100 text-slate-600 border-slate-200',
//   };

//   const priorityColor =
//     priorityStyles[ticket.priority as keyof typeof priorityStyles] ||
//     priorityStyles.LOW;

//   return (
//     <Draggable draggableId={ticket.id.toString()} index={index}>
//       {(provided, snapshot) => (
//         <div
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           {...provided.dragHandleProps}
//           style={{ ...provided.draggableProps.style }}
//           className={`
//             bg-white p-5 rounded-xl border border-slate-200 shadow-sm group
//             transition-all duration-200 hover:shadow-md hover:border-indigo-200
//             ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-indigo-500 rotate-2 scale-105 z-50' : ''}
//           `}
//         >
//           {/* Header: ID and Priority */}
//           <div className="flex justify-between items-start mb-3">
//             <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
//               #{ticket.ticket_id}
//             </span>
//             <span
//               className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityColor}`}
//             >
//               {ticket.priority}
//             </span>
//           </div>

//           {/* Title */}
//           <h4 className="font-semibold text-slate-800 leading-snug mb-3 text-sm">
//             <Link
//               href={`/tickets/${ticket.id}`}
//               className="hover:text-indigo-600 transition-colors"
//             >
//               {ticket.title}
//             </Link>
//           </h4>

//           {/* SLA Warning */}
//           {ticket.is_sla_breached && (
//             <div className="mb-3 flex items-center gap-1.5 text-rose-600 bg-rose-50 p-2 rounded-lg text-xs font-semibold">
//               <AlertCircle className="w-3.5 h-3.5" />
//               <span>SLA Breached</span>
//             </div>
//           )}

//           <div className="h-px bg-slate-100 w-full my-3" />

//           {/* Footer: Assignee & Date */}
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-1.5 text-xs text-slate-500">
//               <UserCircle2 className="w-4 h-4 text-slate-400" />
//               <span className="font-medium truncate max-w-20">
//                 {ticket.assignee_name?.split(' ')[0] || 'Unassigned'}
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
//               <Calendar className="w-3 h-3" />
//               <span>
//                 {new Date(ticket.created_at).toLocaleDateString(undefined, {
//                   month: 'short',
//                   day: 'numeric',
//                 })}
//               </span>
//             </div>
//           </div>
//         </div>
//       )}
//     </Draggable>
//   );
// };
