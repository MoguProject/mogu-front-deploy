import axios, { AxiosRequestConfig } from 'axios';
import { backUrl } from 'config/config';
const config: AxiosRequestConfig = {
  baseURL: 'http://13.124.27.209:8080',
  withCredentials: true,
};
export const axiosInstance = axios.create(config);
