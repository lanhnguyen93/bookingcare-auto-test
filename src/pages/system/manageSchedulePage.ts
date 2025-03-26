import { Page as PlaywrightPage, expect } from "@playwright/test";
import { Page } from "../basePage";

export class ManageSchedulePage extends Page {
  readonly pageUrl: string;

  constructor(page: PlaywrightPage) {
    super(page);
    this.pageUrl = process.env.MANAGE_SCHEDULE_URL || "/";
  }

  //Locators

  async goto() {
    const response = await this.page.goto(this.pageUrl);
    expect(response?.status()).toBeLessThan(400);
  }

  async waitForLoad() {
    await this.page.waitForURL(this.pageUrl, { timeout: 30000 });
    // await expect(this.logoutButton).toBeVisible({ timeout: 30000 });
    await expect(this.page).toHaveTitle("Manage Schedule");
  }
}
