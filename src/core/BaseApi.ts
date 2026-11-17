import { APIRequestContext, APIResponse } from "@playwright/test";

export class BaseApi {
  constructor(protected readonly request: APIRequestContext) {}

  async get(
    endpoint: string,
    options?: Parameters<APIRequestContext["get"]>[1],
  ): Promise<APIResponse> {
    return this.request.get(endpoint, options);
  }

  async post(
    endpoint: string,
    options?: Parameters<APIRequestContext["post"]>[1],
  ): Promise<APIResponse> {
    return this.request.post(endpoint, options);
  }

  async put(
    endpoint: string,
    options?: Parameters<APIRequestContext["put"]>[1],
  ): Promise<APIResponse> {
    return this.request.put(endpoint, options);
  }

  async patch(
    endpoint: string,
    options?: Parameters<APIRequestContext["patch"]>[1],
  ): Promise<APIResponse> {
    return this.request.patch(endpoint, options);
  }

  async delete(
    endpoint: string,
    options?: Parameters<APIRequestContext["delete"]>[1],
  ): Promise<APIResponse> {
    return this.request.delete(endpoint, options);
  }
}
