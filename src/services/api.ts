import ky from 'ky'
export const api = ky.create({
  prefixUrl: 'https://localhost:4000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})