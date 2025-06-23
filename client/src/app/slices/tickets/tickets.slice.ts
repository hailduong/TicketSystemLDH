// client/src/app/slices/tickets/tickets.slice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {TTicket} from './tickets.types'
import {
  fetchTickets,
  fetchTicketById,
  createTicket,
  assignTicket,
  unassignTicket,
  markComplete,
  markIncomplete
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
    builder.addCase(fetchTickets.pending, (state) => {
      state.loadingList = true
      state.error = null
    })
    builder.addCase(fetchTickets.fulfilled, (state, action: PayloadAction<TTicket[]>) => {
      state.loadingList = false
      state.tickets = action.payload
    })
    builder.addCase(fetchTickets.rejected, (state, action) => {
      state.loadingList = false
      state.error = (action.payload as string) || action.error.message || 'Failed to load tickets'
    })

    // Fetch ticket details
    builder.addCase(fetchTicketById.pending, (state) => {
      state.loadingDetails = true
      state.error = null
    })
    builder.addCase(fetchTicketById.fulfilled, (state, action: PayloadAction<TTicket>) => {
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
    builder.addCase(fetchTicketById.rejected, (state, action) => {
      state.loadingDetails = false
      state.error = (action.payload as string) || action.error.message || 'Failed to load ticket details'
    })

    // Create ticket
    builder.addCase(createTicket.pending, (state) => {
      state.saving = true
      state.error = null
    })
    builder.addCase(createTicket.fulfilled, (state, action: PayloadAction<Partial<TTicket>>) => {
      state.saving = false
      state.tickets.push(action.payload)
    })
    builder.addCase(createTicket.rejected, (state, action) => {
      state.saving = false
      state.error = (action.payload as string) || action.error.message || 'Failed to create ticket'
    })

    // Assign ticket
    builder.addCase(assignTicket.pending, (state) => {
      state.saving = true
      state.error = null
    })
    builder.addCase(assignTicket.fulfilled, (state, action) => {
      state.saving = false
      // No direct payload, ticket updated via fetchTicketById thunk
    })
    builder.addCase(assignTicket.rejected, (state, action) => {
      state.saving = false
      state.error = (action.payload as string) || action.error.message || 'Failed to assign ticket'
    })

    // Unassign ticket
    builder.addCase(unassignTicket.pending, (state) => {
      state.saving = true
      state.error = null
    })
    builder.addCase(unassignTicket.fulfilled, (state, action) => {
      state.saving = false
    })
    builder.addCase(unassignTicket.rejected, (state, action) => {
      state.saving = false
      state.error = (action.payload as string) || action.error.message || 'Failed to unassign ticket'
    })

    // Mark complete
    builder.addCase(markComplete.pending, (state) => {
      state.saving = true
      state.error = null
    })
    builder.addCase(markComplete.fulfilled, (state, action) => {
      state.saving = false
    })
    builder.addCase(markComplete.rejected, (state, action) => {
      state.saving = false
      state.error = (action.payload as string) || action.error.message || 'Failed to mark ticket complete'
    })

    // Mark incomplete
    builder.addCase(markIncomplete.pending, (state) => {
      state.saving = true
      state.error = null
    })
    builder.addCase(markIncomplete.fulfilled, (state, action) => {
      state.saving = false
    })
    builder.addCase(markIncomplete.rejected, (state, action) => {
      state.saving = false
      state.error = (action.payload as string) || action.error.message || 'Failed to mark ticket incomplete'
    })
  }
})

export default ticketsSlice.reducer
