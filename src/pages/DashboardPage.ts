import { Page, Locator } from "@playwright/test";
import { BasePage } from "@core/BasePage";
import { Logger } from "@core/Logger";

export class DashboardPage extends BasePage {
  //readonly btn_Login: Locator;

  constructor(page: Page) {
    super(page);

    //this.btn_Login = page.getByRole("button", { name: "Login" });
  }

  async smartButtonClick(buttonName: string) {
    const btnElement = this.page.getByRole("button", { name: buttonName });
    Logger.info(`Clicking the button " ${buttonName} "`);
    await this.waitForVisible(btnElement);
    await this.click(btnElement);
    Logger.info(`button " ${buttonName} " has been clicked successfuly`);
    await this.pause(3);
  }
}
