import axios from 'axios';

export const API_ENDPOINTS = {
  USERS: '/users',
  TICKETS: '/tickets',
} as const

const isProduction = true;

const baseURL = isProduction
  ? 'https://ticket-system-ldh-a96486055de3.herokuapp.com/api'
  : '/api';

const httpService = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default httpService;
