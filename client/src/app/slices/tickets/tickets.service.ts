import httpService from '../httpService'
import type {
  TTicketsResponse,
  TTicket,
  TCreateTicketPayload,
} from './tickets.types'

const TICKETS_URL = '/tickets'

/**
 * Fetches all tickets from the backend.
 */
export const fetchTickets = async (): Promise<TTicketsResponse> => {
  const response = await httpService.get<TTicketsResponse>(TICKETS_URL)
  return response.data
}

/**
 * Fetch a single ticket by ID.
 */
export const fetchTicketById = async (id: number): Promise<TTicket> => {
  const response = await httpService.get<TTicket>(`${TICKETS_URL}/${id}`)
  return response.data
}

/**
 * Creates a new ticket.
 */
export const createTicket = async (
  payload: TCreateTicketPayload
): Promise<TTicket> => {
  debugger;
  const response = await httpService.post<TTicket>(TICKETS_URL, payload)
  debugger
  return response.data
}

/**
 * Assigns a ticket to a user.
 */
export const assignTicket = async (
  ticketId: number,
  userId: number
): Promise<void> => {
  await httpService.put(`${TICKETS_URL}/${ticketId}/assign/${userId}`)
}

/**
 * Unassigns a ticket.
 */
export const unassignTicket = async (ticketId: number): Promise<void> => {
  await httpService.put(`${TICKETS_URL}/${ticketId}/unassign`)
}

/**
 * Marks a ticket as complete.
 */
export const markComplete = async (ticketId: number): Promise<void> => {
  await httpService.put(`${TICKETS_URL}/${ticketId}/complete`)
}

/**
 * Marks a ticket as incomplete.
 */
export const markIncomplete = async (ticketId: number): Promise<void> => {
  await httpService.delete(`${TICKETS_URL}/${ticketId}/complete`)
}
