import {createAsyncThunk} from '@reduxjs/toolkit'
import userService from 'client/src/app/slices/users/users.service'
import type {TUser} from 'client/src/app/slices/users/users.types'

/**
 * Async thunk to fetch the list of users from the backend.
 */
export const fetchUsers = createAsyncThunk<TUser[], void>(
  'users/fetchUsers',
  async (_, thunkAPI) => {
    try {
      const users = await userService.fetchUsers()
      return users
    } catch (error) {
      // Return error message for rejected action
      return thunkAPI.rejectWithValue(
        (error as Error).message || 'Failed to fetch users'
      )
    }
  }
)
