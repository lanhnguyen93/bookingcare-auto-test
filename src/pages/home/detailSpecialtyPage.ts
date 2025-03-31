import { Page as PlaywrightPage, expect } from "@playwright/test";
import { Page } from "../basePage";

export class DetailSpecialtyPage extends Page {
  readonly pageUrl: string;

  constructor(page: PlaywrightPage) {
    super(page);
    this.pageUrl = process.env.DETAIL_SPECIALTY_URL || "/";
  }

  // Locators
  doctorInforItems = this.page.locator(".doctor-infor");

  async goto() {
    const response = await this.page.goto(this.pageUrl);
    await expect(response?.status()).toBeLessThan(400);
  }

  async waitForLoad() {
    await this.page.waitForURL(this.pageUrl, { timeout: 30000 });
    await this.doctorInforItems.first().isVisible();
  }
}
