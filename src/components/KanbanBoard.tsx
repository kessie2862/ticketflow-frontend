'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Ticket } from '../types';
import { ResolutionModal } from './ResolutionModal';
import { useTickets } from '@/hooks/useTickets';
import { KanbanTicket } from './KanbanTicket';

const columns = {
  OPEN: { title: 'Open', id: 'OPEN', color: '#60a5fa' },
  IN_PROGRESS: { title: 'In Progress', id: 'IN_PROGRESS', color: '#818cf8' },
  RESOLVED: { title: 'Resolved', id: 'RESOLVED', color: '#34d399' },
};

export default function KanbanBoard({ tickets }: { tickets: Ticket[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingTicketId, setPendingTicketId] = useState<number | null>(null);
  const { useUpdateTicketStatus } = useTickets();
  const { mutate: updateStatus } = useUpdateTicketStatus();

  const getColumnTickets = (status: string) =>
    tickets.filter((t) => t.status === status);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const ticketId = parseInt(draggableId);
    const newStatus = destination.droppableId as Ticket['status'];

    if (newStatus === 'RESOLVED') {
      setPendingTicketId(ticketId);
      setIsModalOpen(true);
      return;
    }

    updateStatus({ id: ticketId, status: newStatus });
  };

  const handleResolutionSubmit = (note: string) => {
    if (pendingTicketId) {
      updateStatus({ id: pendingTicketId, status: 'RESOLVED', notes: note });
    }
    setIsModalOpen(false);
    setPendingTicketId(null);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full items-start">
          {Object.values(columns).map((col) => (
            <div
              key={col.id}
              className="flex flex-col h-full rounded-2xl p-2"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-3 py-3 mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: col.color }}
                  />
                  <h3
                    className="font-mono text-xs tracking-[0.2em] uppercase"
                    style={{ color: 'var(--muted)' }}
                  >
                    {col.title}
                  </h3>
                </div>
                <span
                  className="font-mono text-xs px-2.5 py-0.5 rounded-full"
                  style={{
                    background: 'var(--surface-2)',
                    color: 'var(--muted)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {getColumnTickets(col.id).length}
                </span>
              </div>

              {/* Droppable */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 space-y-3 p-2 rounded-xl transition-all"
                    style={{
                      minHeight: '150px',
                      background: snapshot.isDraggingOver
                        ? 'rgba(198,241,53,0.04)'
                        : 'transparent',
                      outline: snapshot.isDraggingOver
                        ? '1px solid rgba(198,241,53,0.2)'
                        : 'none',
                    }}
                  >
                    {getColumnTickets(col.id).map((ticket, index) => (
                      <KanbanTicket
                        key={ticket.id}
                        ticket={ticket}
                        index={index}
                      />
                    ))}
                    {provided.placeholder}

                    {getColumnTickets(col.id).length === 0 &&
                      !snapshot.isDraggingOver && (
                        <div
                          className="h-32 rounded-xl flex items-center justify-center font-mono text-xs tracking-widest uppercase"
                          style={{
                            border: '1px dashed var(--border)',
                            color: 'var(--muted)',
                          }}
                        >
                          No tickets
                        </div>
                      )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <ResolutionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleResolutionSubmit}
      />
    </>
  );
}

// // src/components/KanbanBoard.tsx

// 'use client';

// import { useState } from 'react';
// import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
// import { Ticket } from '../types';
// import { ResolutionModal } from './ResolutionModal';
// import { useTickets } from '@/hooks/useTickets';
// import { KanbanTicket } from './KanbanTicket';

// const columns = {
//   OPEN: { title: 'Open', id: 'OPEN', color: 'bg-blue-500' },
//   IN_PROGRESS: {
//     title: 'In Progress',
//     id: 'IN_PROGRESS',
//     color: 'bg-indigo-500',
//   },
//   RESOLVED: { title: 'Resolved', id: 'RESOLVED', color: 'bg-emerald-500' },
// };

// export default function KanbanBoard({ tickets }: { tickets: Ticket[] }) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [pendingTicketId, setPendingTicketId] = useState<number | null>(null);
//   const { useUpdateTicketStatus } = useTickets();
//   const { mutate: updateStatus } = useUpdateTicketStatus();

//   const getColumnTickets = (status: string) =>
//     tickets.filter((t) => t.status === status);

//   const onDragEnd = (result: DropResult) => {
//     const { destination, source, draggableId } = result;
//     if (!destination) return;
//     if (
//       destination.droppableId === source.droppableId &&
//       destination.index === source.index
//     )
//       return;

//     const ticketId = parseInt(draggableId);
//     const newStatus = destination.droppableId as Ticket['status'];

//     if (newStatus === 'RESOLVED') {
//       setPendingTicketId(ticketId);
//       setIsModalOpen(true);
//       return;
//     }

//     updateStatus({ id: ticketId, status: newStatus });
//   };

//   const handleResolutionSubmit = (note: string) => {
//     if (pendingTicketId) {
//       updateStatus({
//         id: pendingTicketId,
//         status: 'RESOLVED',
//         notes: note,
//       });
//     }
//     setIsModalOpen(false);
//     setPendingTicketId(null);
//   };

//   return (
//     <>
//       <DragDropContext onDragEnd={onDragEnd}>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-start">
//           {Object.values(columns).map((col) => (
//             <div
//               key={col.id}
//               className="flex flex-col h-full bg-slate-50/50 rounded-2xl border border-slate-200/60 p-2 shadow-sm"
//             >
//               {/* Column Header */}
//               <div className="flex items-center justify-between p-3 mb-2">
//                 <div className="flex items-center gap-2">
//                   <div className={`w-2 h-2 rounded-full ${col.color}`} />
//                   <h3 className="font-bold text-slate-700 text-sm tracking-tight">
//                     {col.title}
//                   </h3>
//                 </div>
//                 <span className="bg-white text-slate-500 text-xs font-bold px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
//                   {getColumnTickets(col.id).length}
//                 </span>
//               </div>

//               {/* Droppable Area */}
//               <Droppable droppableId={col.id}>
//                 {(provided, snapshot) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     className={`
//                       flex-1 space-y-3 min-h-37.5 p-2 rounded-xl transition-colors
//                       ${snapshot.isDraggingOver ? 'bg-indigo-50/50 ring-2 ring-indigo-200 ring-inset' : ''}
//                     `}
//                   >
//                     {getColumnTickets(col.id).map((ticket, index) => (
//                       <KanbanTicket
//                         key={ticket.id}
//                         ticket={ticket}
//                         index={index}
//                       />
//                     ))}
//                     {provided.placeholder}

//                     {getColumnTickets(col.id).length === 0 &&
//                       !snapshot.isDraggingOver && (
//                         <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm">
//                           No tickets
//                         </div>
//                       )}
//                   </div>
//                 )}
//               </Droppable>
//             </div>
//           ))}
//         </div>
//       </DragDropContext>

//       <ResolutionModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSubmit={handleResolutionSubmit}
//       />
//     </>
//   );
// }
