import { LoginPage } from "@pages/LoginPage";
import { env } from "@config/env";
import { Logger } from "@core/Logger";

export class AuthenticationService {
  constructor(private readonly loginPage: LoginPage) {}

  async login(): Promise<void> {
    Logger.info("Starting authentication");
    await this.loginPage.open();
    Logger.info("Entering credentials");

    await this.loginPage.login(env.email, env.password);
    Logger.info("Authentication completed");
  }
}
