// @ts-nocheck
// client/src/app/slices/tickets/tickets.thunks.ts
import {createAsyncThunk} from '@reduxjs/toolkit'
import * as ticketsService from './tickets.service'
import type {TTicket, TCreateTicketPayload} from './tickets.types'

/** Load all tickets */
export const fetchTicketsThunk = createAsyncThunk<TTicket[]>(
  'tickets/fetchTicketsThunk',
  async (_, thunkAPI) => {
    try {
      const tickets = await ticketsService.fetchTickets()
      return tickets
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as Error).message || 'Failed to fetch tickets'
      )
    }
  }
)

/** Load ticket by id */
export const fetchTicketByIdThunk = createAsyncThunk<TTicket, number>(
  'tickets/fetchTicketByIdThunk',
  async (id, thunkAPI) => {
    try {
      const ticket = await ticketsService.fetchTicketById(id)
      return ticket
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as Error).message || 'Failed to fetch ticket'
      )
    }
  }
)

/** Create a new ticket */
export const createTicketThunk = createAsyncThunk<Partial<TTicket>, TCreateTicketPayload>(
  'tickets/createTicketThunk',
  async (payload, thunkAPI) => {
    try {
      const payloadWithDefaults = {
        ...payload,
        completed: false // Default value for completed
      }
      const ticket = await ticketsService.createTicket(payloadWithDefaults)
      return ticket
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as Error).message || 'Failed to create ticket'
      )
    }
  }
)

/** Assign ticket to user */
export const assignTicketThunk = createAsyncThunk<
  void,
  { ticketId: number; userId: number }
>('tickets/assignTicketThunk', async ({ticketId, userId}, thunkAPI) => {
  try {
    await ticketsService.assignTicket(ticketId, userId)
    // After assigning, refetch updated ticket
    return thunkAPI.dispatch(fetchTicketByIdThunk(ticketId))
  } catch (error) {
    return thunkAPI.rejectWithValue(
      (error as Error).message || 'Failed to assign ticket'
    )
  }
})

/** Unassign ticket */
export const unassignTicketThunk = createAsyncThunk<void, number>(
  'tickets/unassignTicketThunk',
  async (ticketId, thunkAPI) => {
    try {
      await ticketsService.unassignTicket(ticketId)
      // Refetch updated ticket after unassign
      return thunkAPI.dispatch(fetchTicketByIdThunk(ticketId))
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as Error).message || 'Failed to unassign ticket'
      )
    }
  }
)

/** Mark ticket as complete */
export const markCompleteThunk = createAsyncThunk<void, number>(
  'tickets/markCompleteThunk',
  async (ticketId, thunkAPI) => {
    try {
      await ticketsService.markComplete(ticketId)
      // Refetch updated ticket after marking complete
      return thunkAPI.dispatch(fetchTicketByIdThunk(ticketId))
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as Error).message || 'Failed to mark ticket complete'
      )
    }
  }
)

/** Mark ticket as incomplete */
export const markIncompleteThunk = createAsyncThunk<void, number>(
  'tickets/markIncompleteThunk',
  async (ticketId, thunkAPI) => {
    try {
      await ticketsService.markIncomplete(ticketId)
      // Refetch updated ticket after marking incomplete
      return thunkAPI.dispatch(fetchTicketByIdThunk(ticketId))
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as Error).message || 'Failed to mark ticket incomplete'
      )
    }
  }
)
