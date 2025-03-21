import axios from "axios";

const axiosInstance = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: import.meta.env.VITE_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
