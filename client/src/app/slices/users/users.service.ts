import httpService from '../httpService';
import type { TUsersResponse } from 'client/src/app/slices/users/users.types';

const USERS_URL = '/users';

/**
 * Fetches the list of users from the backend.
 * @returns Promise resolving to an array of users.
 */
export const fetchUsers = async (): Promise<TUsersResponse> => {
  const response = await httpService.get<TUsersResponse>(USERS_URL);
  return response.data;
};
