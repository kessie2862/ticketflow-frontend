import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { Ticket, DashboardStats, User } from '../types';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export const useTickets = () => {
  const queryClient = useQueryClient();

  const invalidateTicketQueries = (specificTicketId?: number) => {
    const promises = [
      queryClient.invalidateQueries({ queryKey: ['tickets'] }),
      queryClient.invalidateQueries({ queryKey: ['tickets', 'stats'] }),
    ];

    if (specificTicketId) {
      promises.push(
        queryClient.invalidateQueries({
          queryKey: ['tickets', specificTicketId],
        }),
      );
    }
    return Promise.all(promises);
  };

  const useGetTickets = (filter?: 'all' | 'mine') => {
    return useQuery<Ticket[]>({
      queryKey: ['tickets', filter],
      queryFn: async () => {
        const params = new URLSearchParams();
        if (filter === 'mine') params.append('filter', 'mine');
        const { data } = await axiosInstance.get(
          `/tickets/?${params.toString()}`,
        );
        return data;
      },
    });
  };

  const useGetTicket = (id: number) => {
    return useQuery<Ticket>({
      queryKey: ['tickets', id],
      queryFn: async () => {
        const { data } = await axiosInstance.get(`/tickets/${id}/`);
        return data;
      },
    });
  };

  const useGetAssignees = () => {
    return useQuery<User[]>({
      queryKey: ['assignees'],
      queryFn: async () => {
        const { data } = await axiosInstance.get('/tickets/assignees/');
        return data;
      },
    });
  };

  const useGetStats = () => {
    return useQuery<DashboardStats>({
      queryKey: ['tickets', 'stats'],
      queryFn: async () => {
        const { data } = await axiosInstance.get('/tickets/stats/');
        return data;
      },
    });
  };

  const useCreateTicket = () => {
    return useMutation({
      mutationFn: async (newTicket: FormData | Partial<Ticket>) => {
        const { data } = await axiosInstance.post('/tickets/', newTicket, {
          headers: {
            'Content-Type':
              newTicket instanceof FormData
                ? 'multipart/form-data'
                : 'application/json',
          },
        });
        return data;
      },
      onSuccess: () => {
        invalidateTicketQueries();
        toast.success('Ticket created successfully!');
      },
      onError: () => toast.error('Failed to create ticket'),
    });
  };

  const useUpdateTicketStatus = () => {
    return useMutation({
      mutationFn: async ({
        id,
        status,
        notes,
      }: {
        id: number;
        status: Ticket['status'];
        notes?: string;
      }) => {
        const { data } = await axiosInstance.patch(
          `/tickets/${id}/update_status/`,
          {
            status,
            resolution_notes: notes,
          },
        );
        return data;
      },
      onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey: ['tickets'] });
        const previousTickets = queryClient.getQueryData<Ticket[]>(['tickets']);
        if (previousTickets) {
          queryClient.setQueryData<Ticket[]>(
            ['tickets'],
            previousTickets.map((t) =>
              t.id === variables.id ? { ...t, status: variables.status } : t,
            ),
          );
        }
        return { previousTickets };
      },
      onError: (err, variables, context) => {
        if (context?.previousTickets)
          queryClient.setQueryData(['tickets'], context.previousTickets);
        toast.error('Failed to update status');
      },
      onSuccess: (_, variables) => {
        invalidateTicketQueries(variables.id);
        toast.success('Status updated');
      },
    });
  };

  const useUpdateTicket = () => {
    return useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: number;
        data: FormData | Partial<Ticket>;
      }) => {
        const { data: resData } = await axiosInstance.patch(
          `/tickets/${id}/`,
          data,
          {
            headers: {
              'Content-Type':
                data instanceof FormData
                  ? 'multipart/form-data'
                  : 'application/json',
            },
          },
        );
        return resData;
      },
      onSuccess: (_, variables) => {
        invalidateTicketQueries(variables.id);
        toast.success('Ticket updated');
      },
      onError: (error: AxiosError<{ detail: string }>) => {
        const msg = error.response?.data?.detail || 'Failed to update ticket';
        toast.error(msg);
      },
    });
  };

  const useDeleteTicket = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/tickets/${id}/`);
      },
      onSuccess: () => {
        invalidateTicketQueries();
        toast.success('Ticket deleted');
      },
      onError: (error: AxiosError<{ detail: string }>) => {
        const msg = error.response?.data?.detail || 'Failed to delete ticket';
        toast.error(msg);
      },
    });
  };

  const useAddComment = (ticketId: number) => {
    return useMutation({
      mutationFn: async (text: string) => {
        const { data } = await axiosInstance.post('/comments/', {
          ticket: ticketId,
          text,
        });
        return data;
      },
      onSuccess: () => {
        invalidateTicketQueries(ticketId);
        toast.success('Comment added');
      },
      onError: () => toast.error('Failed to add comment'),
    });
  };

  return {
    useGetTickets,
    useGetTicket,
    useGetAssignees,
    useGetStats,
    useCreateTicket,
    useUpdateTicketStatus,
    useUpdateTicket,
    useDeleteTicket,
    useAddComment,
  };
};
