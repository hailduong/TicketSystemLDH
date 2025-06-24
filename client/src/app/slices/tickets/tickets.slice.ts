import { createSlice, PayloadAction, ActionReducerMapBuilder } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { TTicket } from './tickets.types'
import {
  fetchTicketsThunk,
  fetchTicketByIdThunk,
  createTicketThunk,
  assignTicketThunk,
  unassignTicketThunk,
  markCompleteThunk,
  markIncompleteThunk
} from './tickets.thunks'

/* Types */
interface ITicketsState {
  tickets: TTicket[]
  selectedTicket?: TTicket
  loadingList: boolean
  loadingDetails: boolean
  saving: boolean
  error: string | null
}

/* Initial State */
const initialState: ITicketsState = {
  tickets: [],
  selectedTicket: undefined,
  loadingList: false,
  loadingDetails: false,
  saving: false,
  error: null
}

/* Slice */
const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSelectedTicket: (state) => {
      state.selectedTicket = undefined
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<ITicketsState>) => {
    builder
      // Fetch tickets list
      .addCase(fetchTicketsThunk.pending, (state) => {
        state.loadingList = true
        state.error = null
      })
      .addCase(fetchTicketsThunk.fulfilled, (state, { payload }) => {
        state.loadingList = false
        state.tickets = payload
      })
      .addCase(fetchTicketsThunk.rejected, (state, action) => {
        state.loadingList = false
        state.error = action.error.message || 'Failed to load tickets'
      })

      // Fetch ticket details
      .addCase(fetchTicketByIdThunk.pending, (state) => {
        state.loadingDetails = true
        state.error = null
      })
      .addCase(fetchTicketByIdThunk.fulfilled, (state, { payload }) => {
        state.loadingDetails = false
        state.selectedTicket = payload
        state.tickets = state.tickets.map(ticket =>
          ticket.id === payload.id ? payload : ticket
        )
      })
      .addCase(fetchTicketByIdThunk.rejected, (state, action) => {
        state.loadingDetails = false
        state.error = action.error.message || 'Failed to load ticket details'
      })

      // Create ticket
      .addCase(createTicketThunk.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(createTicketThunk.fulfilled, (state, { payload }) => {
        if (payload.id) { // Type guard for partial ticket
          state.saving = false
          state.tickets = [...state.tickets, payload as TTicket]
          state.selectedTicket = payload as TTicket
        }
      })
      .addCase(createTicketThunk.rejected, (state, action) => {
        state.saving = false
        state.error = action.error.message || 'Failed to create ticket'
      })

      // Handle status changing actions
      .addMatcher(
        (action): action is ReturnType<typeof assignTicketThunk.pending> =>
          [
            assignTicketThunk.pending.type,
            unassignTicketThunk.pending.type,
            markCompleteThunk.pending.type,
            markIncompleteThunk.pending.type
          ].includes(action.type),
        (state) => {
          state.saving = true
          state.error = null
        }
      )
      .addMatcher(
        (action): action is ReturnType<typeof assignTicketThunk.fulfilled> =>
          [
            assignTicketThunk.fulfilled.type,
            unassignTicketThunk.fulfilled.type,
            markCompleteThunk.fulfilled.type,
            markIncompleteThunk.fulfilled.type
          ].includes(action.type),
        (state) => {
          state.saving = false
        }
      )
      .addMatcher(
        (action): action is ReturnType<typeof assignTicketThunk.rejected> =>
          [
            assignTicketThunk.rejected.type,
            unassignTicketThunk.rejected.type,
            markCompleteThunk.rejected.type,
            markIncompleteThunk.rejected.type
          ].includes(action.type),
        (state, action) => {
          state.saving = false
          state.error = action.payload as string || 'Operation failed'
        }
      )
  }
})

/* Actions */
export const { clearError, clearSelectedTicket } = ticketsSlice.actions

/* Selectors */
export const selectTickets = (state: RootState) => state.tickets.tickets
export const selectSelectedTicket = (state: RootState) => state.tickets.selectedTicket
export const selectTicketsLoading = (state: RootState) => state.tickets.loadingList
export const selectTicketDetailsLoading = (state: RootState) => state.tickets.loadingDetails
export const selectTicketSaving = (state: RootState) => state.tickets.saving
export const selectTicketsError = (state: RootState) => state.tickets.error

export default ticketsSlice.reducer
