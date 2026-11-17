import { Page, Locator } from "@playwright/test";
import { BasePage } from "../core/BasePage";

export class Page1 extends BasePage {
  readonly getStartedButton: Locator;

  constructor(page: Page) {
    super(page);

    this.getStartedButton = page.getByRole("link", { name: "Get started" });
  }

  async open() {
    await this.navigate("/");
  }

  async clickGetStarted() {
    await this.click(this.getStartedButton);
  }
}
