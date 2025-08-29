/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";
import { AxiosRequestConfig, AxiosResponse, Method } from "axios";

interface ApiCallParams {
  params?: Record<string, string | number>;
  query?: Record<string, any>;
  data?: any;
}

export class ApiBuilder {
  private method: Method;
  private path: string;

  constructor(method: Method, path: string) {
    this.method = method;
    this.path = path;
  }

  public async call<T = any>(
    args: ApiCallParams = {}
  ): Promise<AxiosResponse<T>> {
    const { params, query, data } = args;
    let url = this.path;

    // Replace URL parameters like /users/:id
    if (params) {
      for (const key in params) {
        url = url.replace(`:${key}`, String(params[key]));
      }
    }

    const config: AxiosRequestConfig = {
      method: this.method,
      url: url,
      params: query,
      data: data,
    };

    try {
      const response: AxiosResponse<T> = await api(config);
      return response;
    } catch (error: any) {
      // Re-throw the error with a more helpful message
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "An unknown API error occurred"
      );
    }
  }
}
