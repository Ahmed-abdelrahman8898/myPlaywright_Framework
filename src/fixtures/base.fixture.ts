import { test as base, APIRequestContext } from "@playwright/test";

import { env } from "@config/env";

type BaseFixtures = {
  apiContext: APIRequestContext;
};

export const test = base.extend<BaseFixtures>({
  apiContext: async ({ playwright }, use) => {
    const apiContext = await playwright.request.newContext({
      baseURL: env.apiBaseUrl,
    });

    await use(apiContext);

    await apiContext.dispose();
  },
});
