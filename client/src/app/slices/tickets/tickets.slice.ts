// client/src/app/slices/tickets/tickets.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TTicket } from './tickets.types';
import {
  fetchTickets,
  fetchTicketById,
  createTicket,
  updateTicket,
} from './tickets.thunks';

type TicketsState = {
  tickets: Partial<TTicket>[];
  selectedTicket?: TTicket;
  loadingList: boolean;
  loadingDetails: boolean;
  saving: boolean;
  error: string | null;
};

const initialState: TicketsState = {
  tickets: [],
  selectedTicket: undefined,
  loadingList: false,
  loadingDetails: false,
  saving: false,
  error: null,
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    // Optional: add sync reducers if needed
  },
  extraReducers: (builder) => {
    // Fetch tickets list
    builder.addCase(fetchTickets.pending, (state) => {
      state.loadingList = true;
      state.error = null;
    });
    builder.addCase(fetchTickets.fulfilled, (state, action: PayloadAction<TTicket[]>) => {
      state.loadingList = false;
      state.tickets = action.payload;
    });
    builder.addCase(fetchTickets.rejected, (state, action) => {
      state.loadingList = false;
      state.error = action.payload as string || action.error.message || 'Failed to load tickets';
    });

    // Fetch ticket details
    builder.addCase(fetchTicketById.pending, (state) => {
      state.loadingDetails = true;
      state.error = null;
    });
    builder.addCase(fetchTicketById.fulfilled, (state, action: PayloadAction<TTicket>) => {
      state.loadingDetails = false;
      state.selectedTicket = action.payload;
    });
    builder.addCase(fetchTicketById.rejected, (state, action) => {
      state.loadingDetails = false;
      state.error = action.payload as string || action.error.message || 'Failed to load ticket details';
    });

    // Create ticket
    builder.addCase(createTicket.pending, (state) => {
      state.saving = true;
      state.error = null;
    });
    builder.addCase(createTicket.fulfilled, (state, action: PayloadAction<Partial<TTicket>>) => {
      state.saving = false;
      state.tickets.push(action.payload);
    });
    builder.addCase(createTicket.rejected, (state, action) => {
      state.saving = false;
      state.error = action.payload as string || action.error.message || 'Failed to create ticket';
    });

    // Update ticket
    builder.addCase(updateTicket.pending, (state) => {
      state.saving = true;
      state.error = null;
    });
    builder.addCase(updateTicket.fulfilled, (state, action: PayloadAction<TTicket>) => {
      state.saving = false;
      // Update the ticket in the list and selectedTicket if matches
      const index = state.tickets.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tickets[index] = action.payload;
      }
      if (state.selectedTicket?.id === action.payload.id) {
        state.selectedTicket = action.payload;
      }
    });
    builder.addCase(updateTicket.rejected, (state, action) => {
      state.saving = false;
      state.error = action.payload as string || action.error.message || 'Failed to update ticket';
    });
  },
});

export default ticketsSlice.reducer;
