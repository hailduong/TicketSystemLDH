import {createSlice, ActionReducerMapBuilder} from '@reduxjs/toolkit'
import type {RootState} from '../store'
import type {TTicket} from './tickets.types'
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
  currentListRequestId: string | null
  currentDetailsRequestId: string | null
}

/* Initial State */
const initialState: ITicketsState = {
  tickets: [],
  selectedTicket: undefined,
  loadingList: false,
  loadingDetails: false,
  saving: false,
  error: null,
  currentListRequestId: null,
  currentDetailsRequestId: null
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
      .addCase(fetchTicketsThunk.pending, (state, action) => {
        state.loadingList = true
        state.error = null
        state.currentListRequestId = action.meta.requestId
      })
      .addCase(fetchTicketsThunk.fulfilled, (state, action) => {
        // only accept if this is the latest list request
        if (action.meta.requestId !== state.currentListRequestId) return
        state.loadingList = false
        state.tickets = action.payload
        state.currentListRequestId = null
      })
      .addCase(fetchTicketsThunk.rejected, (state, action) => {
        if (action.meta.requestId !== state.currentListRequestId) return
        state.loadingList = false
        state.error = action.error.message || 'Failed to load tickets'
        state.currentListRequestId = null
      })

      // Fetch ticket details
      .addCase(fetchTicketByIdThunk.pending, (state, action) => {
        state.loadingDetails = true
        state.error = null
        state.currentDetailsRequestId = action.meta.requestId
      })
      .addCase(fetchTicketByIdThunk.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.currentDetailsRequestId) return
        state.loadingDetails = false
        state.selectedTicket = action.payload
        // also update list entry if present
        state.tickets = state.tickets.map(ticket =>
          ticket.id === action.payload.id ? action.payload : ticket
        )
        state.currentDetailsRequestId = null
      })
      .addCase(fetchTicketByIdThunk.rejected, (state, action) => {
        if (action.meta.requestId !== state.currentDetailsRequestId) return
        state.loadingDetails = false
        state.error = action.error.message || 'Failed to load ticket details'
        state.currentDetailsRequestId = null
      })

      // Create ticket
      .addCase(createTicketThunk.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(createTicketThunk.fulfilled, (state, {payload}) => {
        if (payload.id) {
          state.saving = false
          state.tickets = [...state.tickets, payload as TTicket]
          state.selectedTicket = payload as TTicket
        }
      })
      .addCase(createTicketThunk.rejected, (state, action) => {
        state.saving = false
        state.error = action.error.message || 'Failed to create ticket'
      })

      // Handle status-changing actions (assign/unassign/complete/incomplete)
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
export const {clearError, clearSelectedTicket} = ticketsSlice.actions

/* Selectors */
export const selectTickets = (state: RootState) => state.tickets.tickets
export const selectSelectedTicket = (state: RootState) => state.tickets.selectedTicket
export const selectTicketsLoading = (state: RootState) => state.tickets.loadingList
export const selectTicketDetailsLoading = (state: RootState) => state.tickets.loadingDetails
export const selectTicketSaving = (state: RootState) => state.tickets.saving
export const selectTicketsError = (state: RootState) => state.tickets.error

export default ticketsSlice.reducer
