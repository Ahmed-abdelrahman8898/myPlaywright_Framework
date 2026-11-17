import { BaseApi } from "@core/BaseApi";
import { APIRequestContext } from "@playwright/test";

export class ApiServices extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }
}
