import { test as base } from "@playwright/test";
import { ApiServices } from "@api/ApiServices";
import { env } from "@config/env";

type ApiFixtures = {
  apiServices: ApiServices;
};

export const test = base.extend<ApiFixtures>({
  apiServices: async ({ playwright }, use) => {
    const request = await playwright.request.newContext({
      baseURL: env.apiBaseUrl,
    });

    await use(new ApiServices(request));

    await request.dispose();
  },
});

export { expect } from "@playwright/test";
