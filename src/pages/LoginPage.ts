import { Page, Locator } from "@playwright/test";
import { BasePage } from "@core/BasePage";
import { Logger } from "@core/Logger";

export class LoginPage extends BasePage {
  readonly path = "/login";

  readonly txtbox_UserName: Locator;
  readonly txtbox_Pwd: Locator;
  readonly btn_Login: Locator;
  readonly h_Dashboard: Locator;

  constructor(page: Page) {
    super(page);

    this.txtbox_UserName = page.getByRole("textbox", { name: "Email:" });
    this.txtbox_Pwd = page.getByRole("textbox", { name: "Password:" });
    this.btn_Login = page.getByRole("button", { name: "Login" });
    this.h_Dashboard = page.getByRole("heading", { name: "Dashboard" });
  }

  async open(): Promise<void> {
    await super.open(this.path);
  }

  async enterUsername(username: string) {
    await this.fill(this.txtbox_UserName, username);
  }

  async enterPassword(password: string) {
    await this.fill(this.txtbox_Pwd, password);
  }

  async clickLogin() {
    await this.click(this.btn_Login);
  }

  async login(username: string, password: string) {
    Logger.info(`Entering username : ${username}`);

    await this.enterUsername(username);

    Logger.info("Entering password");

    await this.enterPassword(password);

    Logger.info("Clicking Login");

    await this.clickLogin();
    await this.pause(3);
    await this.waitForVisible(this.h_Dashboard);
    Logger.info("Login is successful ");
    //await this.page.pause();
  }
}
