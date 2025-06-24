import httpService from '../httpService'
import type {TTicketsResponse, TTicket, TCreateTicketPayload} from './tickets.types'
import axios from 'axios'

const TICKETS_URL = '/tickets'
const TIMEOUT = 10000 // 10 seconds

/**
 * Helper to handle HTTP errors consistently
 * @throws {Error} Throws error with appropriate message
 */
const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.message || error.message)
  }
  throw error
}

/**
 * Fetches all tickets from the backend.
 */
export const fetchTickets = async (): Promise<TTicketsResponse> => {
  try {
    const response = await httpService.get<TTicketsResponse>(TICKETS_URL, {
      timeout: TIMEOUT
    })
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Fetch a single ticket by ID.
 */
export const fetchTicketById = async (id: number): Promise<TTicket> => {
  try {
    const response = await httpService.get<TTicket>(`${TICKETS_URL}/${id}`, {
      timeout: TIMEOUT
    })
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Creates a new ticket.
 */
export const createTicket = async (
  payload: TCreateTicketPayload
): Promise<TTicket> => {
  try {
    const response = await httpService.post<TTicket>(TICKETS_URL, payload, {
      timeout: TIMEOUT
    })
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Assigns a ticket to a user.
 */
export const assignTicket = async (
  ticketId: number,
  userId: number
): Promise<void> => {
  try {
    await httpService.put(
      `${TICKETS_URL}/${ticketId}/assign/${userId}`,
      null,
      {timeout: TIMEOUT}
    )
  } catch (error) {
    handleError(error)
  }
}

/**
 * Unassigns a ticket.
 */
export const unassignTicket = async (ticketId: number): Promise<void> => {
  try {
    await httpService.put(
      `${TICKETS_URL}/${ticketId}/unassign`,
      null,
      {timeout: TIMEOUT}
    )
  } catch (error) {
    handleError(error)
  }
}

/**
 * Marks a ticket as complete.
 */
export const markComplete = async (ticketId: number): Promise<void> => {
  try {
    await httpService.put(
      `${TICKETS_URL}/${ticketId}/complete`,
      null,
      {timeout: TIMEOUT}
    )
  } catch (error) {
    handleError(error)
  }
}

/**
 * Marks a ticket as incomplete.
 */
export const markIncomplete = async (ticketId: number): Promise<void> => {
  try {
    await httpService.delete(
      `${TICKETS_URL}/${ticketId}/complete`,
      {timeout: TIMEOUT}
    )
  } catch (error) {
    handleError(error)
  }
}
