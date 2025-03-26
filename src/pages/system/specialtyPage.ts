import { Page as PlaywrightPage, expect } from "@playwright/test";
import { Page } from "../basePage";

export class SpecialtyPage extends Page {
  readonly pageUrl: string;

  constructor(page: PlaywrightPage) {
    super(page);
    this.pageUrl = process.env.SPECIALTY_URL || "/";
  }

  // Locators
  specialtyCombobox = this.page.getByRole("combobox");
  specialtyName = this.page.locator(".content-left input");
  specialtyImage = this.page.locator(".content-right input");
  specialtyDescription = this.page.locator(".markdown-content textarea");
  

  async goto() {
    const response = await this.page.goto(this.pageUrl);
    expect(response?.status()).toBeLessThan(400);
  }

  async waitForLoad() {
    await this.page.waitForURL(this.pageUrl, { timeout: 30000 });
    // await expect(this.emailCells.last()).toBeVisible({ timeout: 30000 });
  }

  async fillForm() {}
}
