// client/src/app/slices/tickets/tickets.types.ts

/**
 * Ticket status enum for clarity and type safety.
 */
export type TTicketStatus = 'open' | 'completed';

/**
 * Ticket type representing a single ticket.
 */
export type TTicket = {
  id: number;
  description: string;
  assigneeId: number | null;
  completed: boolean;
};

/**
 * API response type for multiple tickets.
 */
export type TTicketsResponse = TTicket[];

/**
 * Payload for creating a new ticket.
 */
export type TCreateTicketPayload = {
  description: string;
  assigneeId?: number | null;
};

/**
 * Payload for updating a ticket partially.
 */
export type TUpdateTicketPayload = Partial<{
  description: string;
  assigneeId: number | null;
  completed: boolean;
}>;
