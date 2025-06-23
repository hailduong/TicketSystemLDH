import axiosInstance from '../axiosInstance';
import type {
  TTicketsResponse,
  TTicket,
  TCreateTicketPayload,
  TUpdateTicketPayload,
} from './tickets.types';

const TICKETS_URL = '/tickets';

/**
 * Fetches all tickets from the backend.
 */
export const fetchTickets = async (): Promise<TTicketsResponse> => {
  const response = await axiosInstance.get<TTicketsResponse>(TICKETS_URL);
  return response.data;
};

/**
 * Fetch a single ticket by ID.
 */
export const fetchTicketById = async (id: number): Promise<TTicket> => {
  const response = await axiosInstance.get<TTicket>(`${TICKETS_URL}/${id}`);
  return response.data;
};

/**
 * Creates a new ticket.
 */
export const createTicket = async (
  payload: TCreateTicketPayload
): Promise<TTicket> => {
  const response = await axiosInstance.post<TTicket>(TICKETS_URL, payload);
  return response.data;
};

/**
 * Updates a ticket partially.
 */
export const updateTicket = async (
  id: number,
  payload: TUpdateTicketPayload
): Promise<TTicket> => {
  const response = await axiosInstance.patch<TTicket>(
    `${TICKETS_URL}/${id}`,
    payload
  );
  return response.data;
};
