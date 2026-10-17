import axios from "axios";
import { mainURL } from "../../Api/Constants";
import {
  getAuthHeaders,
  handleUnauthorized,
  isUnauthorizedError,
  isPublicEndpoint,
} from "../../ApiServices/ApiService";

const axiosInstance = axios.create({
  baseURL: mainURL,
  timeout: 15000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      if (isPublicEndpoint(config.url)) {
        return config;
      }
      const { headers, expired } = await getAuthHeaders();
      if (expired) {
        return Promise.reject(new Error("Session expired. Please login again."));
      }
      Object.assign(config.headers, headers);
      if (typeof FormData !== "undefined" && config.data instanceof FormData) {
        if (typeof config.headers.delete === "function") {
          config.headers.delete("Content-Type");
          config.headers.delete("content-type");
        } else {
          delete config.headers["Content-Type"];
          delete config.headers["content-type"];
        }
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!isPublicEndpoint(error?.config?.url) && isUnauthorizedError(error)) {
      await handleUnauthorized();
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  async apiCall(endpoint, method = "get", data = null, headers = {}) {
    try {
      const response = await axiosInstance({
        method,
        url: endpoint,
        data,
        headers,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.message || "Server Error");
      } else if (error.request) {
        throw new Error("No response from server. Please check your network.");
      } else {
        throw new Error(error.message);
      }
    }
  },
};
