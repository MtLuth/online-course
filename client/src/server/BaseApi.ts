import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import Cookies from "js-cookie";

class BaseApi {
  protected axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL: "http://localhost:8080/api/v1",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    this.setAuthHeader();
    this.setupInterceptors();
  }

  private setAuthHeader() {
    const token = Cookies.get("accessToken");
    if (token) {
      this.axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }
  }
  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = Cookies.get("accessToken");
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response) {
          console.error("API error:", error.response);
          return Promise.reject(error.response.data);
        } else if (error.request) {
          console.error("No response from server:", error.request);
          return Promise.reject({ message: "No response from server." });
        } else {
          console.error("Error setting up request:", error.message);
          return Promise.reject({ message: "Error setting up request." });
        }
      }
    );
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance
      .get<T>(url, config)
      .then((response) => response.data);
  }

  protected async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.axiosInstance
      .post<T>(url, data, config)
      .then((response) => response.data);
  }

  protected async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.axiosInstance
      .put<T>(url, data, config)
      .then((response) => response.data);
  }

  protected async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.axiosInstance
      .delete<T>(url, config)
      .then((response) => response.data);
  }
}

export default BaseApi;
