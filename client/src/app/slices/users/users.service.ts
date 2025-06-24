import type {AxiosResponse} from 'axios'
import httpService from '../httpService'
import type {TUsersResponse} from './users.types'

const API_ENDPOINTS = {
  USERS: '/users'
} as const

interface IUserService {
  fetchUsers(): Promise<TUsersResponse>;
}

/**
 * Service responsible for handling user-related API calls
 */
class UserService implements IUserService {
  /**
   * Retrieves a list of all users from the backend
   * @throws {Error} When the API request fails
   * @returns Promise resolving to an array of users
   */
  public async fetchUsers(): Promise<TUsersResponse> {
    try {
      const response: AxiosResponse<TUsersResponse> = await httpService.get<TUsersResponse>(
        API_ENDPOINTS.USERS
      )
      return response.data
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch users'
      )
    }
  }
}


const userService = new UserService()
export default userService
