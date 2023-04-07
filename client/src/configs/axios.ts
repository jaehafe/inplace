import axios, { AxiosInstance } from 'axios';

export const baseURL = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api`;
// process.env.NODE_ENV !== 'production'
// ? process.env.NEXT_PUBLIC_SERVER_DEV_URL
// : process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: false,
});
