import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {TUser} from './users.types'
import {fetchUsers} from './users.thunks'

interface IUsersState {
  users: TUser[];
  loading: boolean;
  error: string | null;
}

const SLICE_NAME = 'users'

/**
 * Initial state for the users slice
 */
const initialState: IUsersState = {
  users: [],
  loading: false,
  error: null
}

/**
 * Users slice containing reducers and state management logic
 */
const usersSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = []
      state.error = null
    },
    resetError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle loading state
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      // Handle successful fetch
      .addCase(
        fetchUsers.fulfilled,
        (state, {payload}: PayloadAction<TUser[]>) => {
          state.loading = false
          state.users = payload
          state.error = null
        }
      )
      // Handle error state
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Failed to load users'
        state.users = []
      })
  }
})

// Export actions
export const {clearUsers, resetError} = usersSlice.actions

// Export reducer
export default usersSlice.reducer
