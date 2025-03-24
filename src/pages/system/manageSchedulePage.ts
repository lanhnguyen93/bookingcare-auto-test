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
    await this.page.waitForLoadState();
  }

  async waitForLoad() {
    await this.page.waitForURL(this.pageUrl);
    await expect(this.page).toHaveTitle("Manage Schedule");
  }
}
