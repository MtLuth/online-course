import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import Cookies from "js-cookie";

class BaseApi {
  protected axiosInstance: AxiosInstance;

  constructor(prefixUrl: string = "") {
    this.axiosInstance = axios.create({
      baseURL: `http://localhost:8080/api/v1`,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = Cookies.get("token");
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

  protected get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance
      .get(url, config)
      .then((response) => response.data);
  }

  protected post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.axiosInstance
      .post(url, data, config)
      .then((response) => response.data);
  }

  protected put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.axiosInstance
      .put(url, data, config)
      .then((response) => response.data);
  }

  protected delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance
      .delete(url, config)
      .then((response) => response.data);
  }
}

export default BaseApi;
