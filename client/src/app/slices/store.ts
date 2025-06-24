import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './users/users.slice';
import ticketsReducer from './tickets/tickets.slice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    tickets: ticketsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
