import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TUser } from 'client/src/app/slices/users/users.types';
import { fetchUsers } from 'client/src/app/slices/users/users.thunks';

type UsersState = {
  users: TUser[];
  loading: boolean;
  error: string | null;
};

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // You can add synchronous reducers here if needed in future
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<TUser[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to load users';
      });
  },
});

export default usersSlice.reducer;
