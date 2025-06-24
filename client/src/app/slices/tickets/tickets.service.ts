import type { AxiosResponse } from 'axios';
import httpService from '../httpService';
import type { TTicketsResponse, TTicket, TCreateTicketPayload } from './tickets.types';
import axios from 'axios';

/** API endpoints and configuration */
const API_ENDPOINTS = {
  TICKETS: '/tickets',
} as const;

const TIMEOUT = 10000; // 10 seconds

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
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }

  public async fetchTickets(): Promise<TTicketsResponse> {
    try {
      const response: AxiosResponse<TTicketsResponse> = await httpService.get<TTicketsResponse>(
        API_ENDPOINTS.TICKETS,
        { timeout: TIMEOUT }
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async fetchTicketById(id: number): Promise<TTicket> {
    try {
      const response: AxiosResponse<TTicket> = await httpService.get<TTicket>(
        `${API_ENDPOINTS.TICKETS}/${id}`,
        { timeout: TIMEOUT }
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async createTicket(payload: TCreateTicketPayload): Promise<TTicket> {
    try {
      const response: AxiosResponse<TTicket> = await httpService.post<TTicket>(
        API_ENDPOINTS.TICKETS,
        payload,
        { timeout: TIMEOUT }
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async assignTicket(ticketId: number, userId: number): Promise<void> {
    try {
      await httpService.put(
        `${API_ENDPOINTS.TICKETS}/${ticketId}/assign/${userId}`,
        null,
        { timeout: TIMEOUT }
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  public async unassignTicket(ticketId: number): Promise<void> {
    try {
      await httpService.put(
        `${API_ENDPOINTS.TICKETS}/${ticketId}/unassign`,
        null,
        { timeout: TIMEOUT }
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  public async markComplete(ticketId: number): Promise<void> {
    try {
      await httpService.put(
        `${API_ENDPOINTS.TICKETS}/${ticketId}/complete`,
        null,
        { timeout: TIMEOUT }
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  public async markIncomplete(ticketId: number): Promise<void> {
    try {
      await httpService.delete(
        `${API_ENDPOINTS.TICKETS}/${ticketId}/complete`,
        { timeout: TIMEOUT }
      );
    } catch (error) {
      this.handleError(error);
    }
  }
}

// Export singleton instance
const ticketService = new TicketService();
export default ticketService;
