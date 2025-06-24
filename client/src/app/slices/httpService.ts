import axios from 'axios';

export const API_ENDPOINTS = {
  USERS: '/users',
  TICKETS: '/tickets',
} as const



const httpService = axios.create({
  baseURL: '/api', // base URL for all API calls
  timeout: 5000,   // optional timeout, 5 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

export default httpService;
