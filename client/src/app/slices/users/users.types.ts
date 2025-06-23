// user.types.ts

/**
 * Represents a user in the system.
 */
export type TUser = {
  id: number;
  name: string;
};

/**
 * API response type for fetching multiple users.
 * Assuming backend returns an array of users directly.
 */
export type TUsersResponse = TUser[];
