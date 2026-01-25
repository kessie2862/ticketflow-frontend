// src/types/index.ts

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Status = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'SUPPORT' | 'EMPLOYEE';
}

export interface Comment {
  id: number;
  ticket: number;
  author: number;
  author_name: string;
  text: string;
  created_at: string;
}

export interface Ticket {
  id: number;
  ticket_id: string;
  title: string;
  description: string;
  requester: number;
  requester_name: string;
  assignee: number | null;
  assignee_name: string | null;
  status: Status;
  priority: Priority;
  attachment_url: string | null;
  resolution_notes: string | null;
  is_sla_breached: boolean;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  comments: Comment[];
}

export interface DashboardStats {
  total_tickets: number;
  avg_resolution_time: string;
  status_distribution: {
    status: Status;
    count: number;
  }[];
}
