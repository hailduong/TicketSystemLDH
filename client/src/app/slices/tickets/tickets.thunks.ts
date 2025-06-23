// client/src/app/slices/tickets/tickets.thunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import * as ticketsService from './tickets.service';
import type {
  TTicket,
  TCreateTicketPayload,
  TUpdateTicketPayload,
} from './tickets.types';

/** Load all tickets */
export const fetchTickets = createAsyncThunk<TTicket[]>(
  'tickets/fetchTickets',
  async (_, thunkAPI) => {
    try {
      const tickets = await ticketsService.fetchTickets();
      return tickets;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as Error).message || 'Failed to fetch tickets'
      );
    }
  }
);

/** Load ticket by id */
export const fetchTicketById = createAsyncThunk<TTicket, number>(
  'tickets/fetchTicketById',
  async (id, thunkAPI) => {
    try {
      const ticket = await ticketsService.fetchTicketById(id);
      return ticket;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as Error).message || 'Failed to fetch ticket'
      );
    }
  }
);

/** Create a new ticket */
export const createTicket = createAsyncThunk<Partial<TTicket>, TCreateTicketPayload>(
  'tickets/createTicket',
  async (payload, thunkAPI) => {
    try {
      const payloadWithDefaults = {
        ...payload,
        completed: false, // Default value for completed
        assigneeId: payload.assigneeId ?? null,
      };
      const ticket = await ticketsService.createTicket(payloadWithDefaults);
      return ticket;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as Error).message || 'Failed to create ticket'
      );
    }
  }
);


/** Update an existing ticket */
export const updateTicket = createAsyncThunk<
  TTicket,
  { id: number; payload: TUpdateTicketPayload }
>(
  'tickets/updateTicket',
  async ({ id, payload }, thunkAPI) => {
    try {
      const ticket = await ticketsService.updateTicket(id, payload);
      return ticket;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as Error).message || 'Failed to update ticket'
      );
    }
  }
);
