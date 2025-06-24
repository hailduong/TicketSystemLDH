import axios from 'axios'
import httpService, {API_ENDPOINTS} from '../httpService'
import type {TTicketsResponse, TTicket, TCreateTicketPayload} from './tickets.types'

/** Interface for Ticket Service operations */
interface ITicketService {
  fetchTickets(): Promise<TTicketsResponse>;

  fetchTicketById(id: number): Promise<TTicket>;

  createTicket(payload: TCreateTicketPayload): Promise<TTicket>;

  assignTicket(ticketId: number, userId: number): Promise<void>;

  unassignTicket(ticketId: number): Promise<void>;

  markComplete(ticketId: number): Promise<void>;

  markIncomplete(ticketId: number): Promise<void>;
}

/**
 * Service responsible for handling ticket-related API calls
 */
class TicketService implements ITicketService {
  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message)
    }
    throw new Error('An unexpected error occurred')
  }

  public async fetchTickets(): Promise<TTicketsResponse> {
    try {
      const response = await httpService.get<TTicketsResponse>(
        API_ENDPOINTS.TICKETS
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async fetchTicketById(id: number): Promise<TTicket> {
    try {
      const response = await httpService.get<TTicket>(
        `${API_ENDPOINTS.TICKETS}/${id}`
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async createTicket(payload: TCreateTicketPayload): Promise<TTicket> {
    try {
      const response = await httpService.post<TTicket>(
        API_ENDPOINTS.TICKETS,
        payload
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async assignTicket(ticketId: number, userId: number): Promise<void> {
    try {
      await httpService.put(
        `${API_ENDPOINTS.TICKETS}/${ticketId}/assign/${userId}`
      )
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async unassignTicket(ticketId: number): Promise<void> {
    try {
      await httpService.put(
        `${API_ENDPOINTS.TICKETS}/${ticketId}/unassign`
      )
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async markComplete(ticketId: number): Promise<void> {
    try {
      await httpService.put(
        `${API_ENDPOINTS.TICKETS}/${ticketId}/complete`
      )
    } catch (error) {
      throw this.handleError(error)
    }
  }

  public async markIncomplete(ticketId: number): Promise<void> {
    try {
      await httpService.delete(
        `${API_ENDPOINTS.TICKETS}/${ticketId}/complete`
      )
    } catch (error) {
      throw this.handleError(error)
    }
  }
}

// Export singleton instance
export default new TicketService()
