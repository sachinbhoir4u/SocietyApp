const ENV = process.env.NODE_ENV || 'development';

const API_URLS = {
  development: 'http://192.168.0.116:5000/api',//'http://localhost:5000/api',
  production: 'https://api.societyapp.com',
};

export const Config = {
  API_BASE_URL: API_URLS[ENV],
};