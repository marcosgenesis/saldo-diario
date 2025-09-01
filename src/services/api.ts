import ky from 'ky';

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  statusCode: number;
  timestamp: string;
}

export const api = ky.create({
  prefixUrl: 'http://localhost:4000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('bearer_token')}`,
  },
})