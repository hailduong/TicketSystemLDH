// client/src/app/slices/tickets/tickets.slice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit'
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

type TicketsState = {
  tickets: Partial<TTicket>[]
  selectedTicket?: TTicket
  loadingList: boolean
  loadingDetails: boolean
  saving: boolean
  error: string | null
}

const initialState: TicketsState = {
  tickets: [],
  selectedTicket: undefined,
  loadingList: false,
  loadingDetails: false,
  saving: false,
  error: null
}

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    // You can add sync reducers here if needed
  },
  extraReducers: (builder) => {
    // Fetch tickets list
    builder.addCase(fetchTicketsThunk.pending, (state) => {
      state.loadingList = true
      state.error = null
    })
    builder.addCase(fetchTicketsThunk.fulfilled, (state, action: PayloadAction<TTicket[]>) => {
      state.loadingList = false
      state.tickets = action.payload
    })
    builder.addCase(fetchTicketsThunk.rejected, (state, action) => {
      state.loadingList = false
      state.error = (action.payload as string) || action.error.message || 'Failed to load tickets'
    })

    // Fetch ticket details
    builder.addCase(fetchTicketByIdThunk.pending, (state) => {
      state.loadingDetails = true
      state.error = null
    })
    builder.addCase(fetchTicketByIdThunk.fulfilled, (state, action: PayloadAction<TTicket>) => {
      state.loadingDetails = false
      state.selectedTicket = action.payload
      // Also update or add ticket in tickets list for consistency
      const index = state.tickets.findIndex(t => t.id === action.payload.id)
      if (index !== -1) {
        state.tickets[index] = action.payload
      } else {
        state.tickets.push(action.payload)
      }
    })
    builder.addCase(fetchTicketByIdThunk.rejected, (state, action) => {
      state.loadingDetails = false
      state.error = (action.payload as string) || action.error.message || 'Failed to load ticket details'
    })

    // Create ticket
    builder.addCase(createTicketThunk.pending, (state) => {
      state.saving = true
      state.error = null
    })
    builder.addCase(createTicketThunk.fulfilled, (state, action: PayloadAction<Partial<TTicket>>) => {
      state.saving = false
      state.tickets.push(action.payload)
    })
    builder.addCase(createTicketThunk.rejected, (state, action) => {
      state.saving = false
      state.error = (action.payload as string) || action.error.message || 'Failed to create ticket'
    })

    // Assign ticket
    builder.addCase(assignTicketThunk.pending, (state) => {
      state.saving = true
      state.error = null
    })
    builder.addCase(assignTicketThunk.fulfilled, (state, action) => {
      state.saving = false
      // No direct payload, ticket updated via fetchTicketByIdThunk thunk
    })
    builder.addCase(assignTicketThunk.rejected, (state, action) => {
      state.saving = false
      state.error = (action.payload as string) || action.error.message || 'Failed to assign ticket'
    })

    // Unassign ticket
    builder.addCase(unassignTicketThunk.pending, (state) => {
      state.saving = true
      state.error = null
    })
    builder.addCase(unassignTicketThunk.fulfilled, (state, action) => {
      state.saving = false
    })
    builder.addCase(unassignTicketThunk.rejected, (state, action) => {
      state.saving = false
      state.error = (action.payload as string) || action.error.message || 'Failed to unassign ticket'
    })

    // Mark complete
    builder.addCase(markCompleteThunk.pending, (state) => {
      state.saving = true
      state.error = null
    })
    builder.addCase(markCompleteThunk.fulfilled, (state, action) => {
      state.saving = false
    })
    builder.addCase(markCompleteThunk.rejected, (state, action) => {
      state.saving = false
      state.error = (action.payload as string) || action.error.message || 'Failed to mark ticket complete'
    })

    // Mark incomplete
    builder.addCase(markIncompleteThunk.pending, (state) => {
      state.saving = true
      state.error = null
    })
    builder.addCase(markIncompleteThunk.fulfilled, (state, action) => {
      state.saving = false
    })
    builder.addCase(markIncompleteThunk.rejected, (state, action) => {
      state.saving = false
      state.error = (action.payload as string) || action.error.message || 'Failed to mark ticket incomplete'
    })
  }
})

export default ticketsSlice.reducer
