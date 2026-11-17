import { test as base } from "@playwright/test";
import { Page1 } from "@pages/Page1";
import { LoginPage } from "@pages/LoginPage";
import { AuthenticationService } from "@services/AuthenticationService";
import { DashboardPage } from "@pages/DashboardPage";

type PageFixtures = {
  page1: Page1;
  loginPage: LoginPage;
  authenticationService: AuthenticationService;
  dashboardPage: DashboardPage;
};

export const test = base.extend<PageFixtures>({
  page1: async ({ page }, use) => {
    const page1 = new Page1(page);

    await use(page1);
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  authenticationService: async ({ loginPage }, use) => {
    await use(new AuthenticationService(loginPage));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export { expect } from "@playwright/test";
