import axios from 'axios'

export const API_ENDPOINTS = {
  USERS: '/users',
  TICKETS: '/tickets'
} as const

const baseURL =
  process.env.REACT_APP_BASE_API_URL || '/api'
console.log('BASE_API_URL:', process.env);

const httpService = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default httpService
