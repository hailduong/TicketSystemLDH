import {createAsyncThunk} from '@reduxjs/toolkit'
import ticketsService from './tickets.service'
import type {TTicket, TCreateTicketPayload} from './tickets.types'
import {RootState} from '../store'


type TAsyncThunkConfig = {
  state: RootState
  rejectValue: string
}

// Base error handler for consistent error messages
const handleError = (error: unknown, defaultMessage: string) => {
  return (error as Error).message || defaultMessage
}

/**
 * Thunks for ticket operations
 */

// Fetch all tickets
export const fetchTicketsThunk = createAsyncThunk<TTicket[], void, TAsyncThunkConfig>(
  'tickets/fetchTicketsThunk',
  async (_, thunkAPI) => {
    try {
      return await ticketsService.fetchTickets()
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error, 'Failed to fetch tickets'))
    }
  }
)

// Fetch single ticket
export const fetchTicketByIdThunk = createAsyncThunk<TTicket, number, TAsyncThunkConfig>(
  'tickets/fetchTicketByIdThunk',
  async (id, thunkAPI) => {
    try {
      return await ticketsService.fetchTicketById(id)
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error, 'Failed to fetch ticket'))
    }
  }
)

// Create ticket
export const createTicketThunk = createAsyncThunk<TTicket, TCreateTicketPayload, TAsyncThunkConfig>(
  'tickets/createTicketThunk',
  async (payload, thunkAPI) => {
    try {
      return await ticketsService.createTicket({
        ...payload,
        completed: false
      })
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error, 'Failed to create ticket'))
    }
  }
)

// Assign ticket
export const assignTicketThunk = createAsyncThunk<TTicket, { ticketId: number; userId: number }, TAsyncThunkConfig>(
  'tickets/assignTicketThunk',
  async ({ticketId, userId}, thunkAPI) => {
    try {
      await ticketsService.assignTicket(ticketId, userId)
      const updatedTicket = await ticketsService.fetchTicketById(ticketId)
      return updatedTicket
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error, 'Failed to assign ticket'))
    }
  }
)

// Unassign ticket
export const unassignTicketThunk = createAsyncThunk<TTicket, number, TAsyncThunkConfig>(
  'tickets/unassignTicketThunk',
  async (ticketId, thunkAPI) => {
    try {
      await ticketsService.unassignTicket(ticketId)
      const updatedTicket = await ticketsService.fetchTicketById(ticketId)
      return updatedTicket
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error, 'Failed to unassign ticket'))
    }
  }
)

// Mark complete
export const markCompleteThunk = createAsyncThunk<TTicket, number, TAsyncThunkConfig>(
  'tickets/markCompleteThunk',
  async (ticketId, thunkAPI) => {
    try {
      await ticketsService.markComplete(ticketId)
      const updatedTicket = await ticketsService.fetchTicketById(ticketId)
      return updatedTicket
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error, 'Failed to mark ticket complete'))
    }
  }
)

// Mark incomplete
export const markIncompleteThunk = createAsyncThunk<TTicket, number, TAsyncThunkConfig>(
  'tickets/markIncompleteThunk',
  async (ticketId, thunkAPI) => {
    try {
      await ticketsService.markIncomplete(ticketId)
      const updatedTicket = await ticketsService.fetchTicketById(ticketId)
      return updatedTicket
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error, 'Failed to mark ticket incomplete'))
    }
  }
)
