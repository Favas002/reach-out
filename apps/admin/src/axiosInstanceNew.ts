import type { HttpError } from "@refinedev/core";
import axios from "axios";

const TOKEN = import.meta.env.VITE_SUPERADMIN_TOKEN;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    };

    return Promise.reject(customError);
  }
);

export { axiosInstance };
