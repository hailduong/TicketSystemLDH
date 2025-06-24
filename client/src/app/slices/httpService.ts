import axios from 'axios';

const httpService = axios.create({
  baseURL: '/api', // base URL for all API calls
  timeout: 5000,   // optional timeout, 5 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

export default httpService;
