import { test, expect } from "@fixtures";

import { Logger } from "@core/Logger";
import { env } from "@config/env";

test("Open Playwright homepage", async ({
  authenticationService,
  dashboardPage,
}) => {
  await test.step("Open Login Page", async () => {
    Logger.debug("Hello from the test!");

    await authenticationService.login();
  });
  await test.step("Verify Dashboard", async () => {
    await dashboardPage.smartButtonClick("Work Items");
  });
});
