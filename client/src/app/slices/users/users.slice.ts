import {createSlice, ActionReducerMapBuilder} from '@reduxjs/toolkit'
import type {TUser} from './users.types'
import {fetchUsers} from './users.thunks'

interface IUsersState {
  users: TUser[];
  loading: boolean;
  error: string | null;
  currentRequestId: string | null
}

const SLICE_NAME = 'users'
const initialState: IUsersState = {
  users: [],
  loading: false,
  error: null,
  currentRequestId: null
}

/**
 * Users slice
 */
const usersSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = []
    },
    resetError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<IUsersState>) => {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.loading = true
        state.error = null
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.currentRequestId) return
        state.loading = false
        state.users = action.payload
        state.currentRequestId = null
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        if (action.meta.requestId !== state.currentRequestId) return
        state.loading = false
        state.error = (action.payload as string) ?? action.error.message ?? 'Failed to load users'
        state.users = []
        state.currentRequestId = null
      })
  }
})

// Export actions
export const {clearUsers, resetError} = usersSlice.actions

// Export reducer
export default usersSlice.reducer
