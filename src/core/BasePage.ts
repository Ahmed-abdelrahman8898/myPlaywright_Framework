import { Locator, Page, expect } from "@playwright/test";
import { Logger } from "@core/Logger";

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  async open(path: string = "/") {
    await this.page.goto(path);
  }

  async navigate(path: string): Promise<void> {
    Logger.info(`Navigating to: ${path}`);
    await this.page.goto(path);
  }
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async click(locator: Locator): Promise<void> {
    Logger.debug("Clicking element");

    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  async fill(locator: Locator, value: string): Promise<void> {
    Logger.debug(`Filling value: ${value}`);

    await locator.fill(value);
  }

  async clear(locator: Locator): Promise<void> {
    Logger.debug("Clearing input");

    await locator.clear();
  }

  async press(locator: Locator, key: string): Promise<void> {
    Logger.debug(`Pressing key: ${key}`);

    await locator.press(key);
  }

  async getText(locator: Locator): Promise<string> {
    Logger.debug("Reading text");

    return (await locator.textContent()) ?? "";
  }
  public async pause(seconds: number): Promise<void> {
    await this.page.waitForTimeout(seconds * 1000);
  }

  async pageReload(): Promise<void> {
    await this.page.reload();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async waitForVisible(locator: Locator): Promise<void> {
    Logger.debug("Waiting for element to become visible");

    await expect(locator).toBeVisible();
  }

  async waitForHidden(locator: Locator): Promise<void> {
    Logger.debug("Waiting for element to become hidden");

    await expect(locator).toBeHidden();
  }

  async takeScreenshot(name: string): Promise<void> {
    Logger.info(`Taking screenshot: ${name}`);

    await this.page.screenshot({
      path: `test-results/${name}.png`,
      fullPage: true,
    });
  }
}
