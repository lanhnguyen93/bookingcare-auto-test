import { Locator, Page as PlaywrightPage, expect } from "@playwright/test";
import { Page } from "../basePage";

export class ManagePatientPage extends Page {
  readonly pageUrl: string;

  constructor(page: PlaywrightPage) {
    super(page);
    this.pageUrl = process.env.MANAGE_PATIENT_URL || "/";
  }

  //Locators
  patientFrame = this.page.locator(".manage-patient-container");
  emptyText = this.page.locator(".empty-text");
  doctorCombobox = this.page.locator(".vs__selected-options");
  doctorItems = this.page.locator("li[role=option]");
  calendar = this.page.locator(".schedule-date");

  async goto() {
    const response = await this.page.goto(this.pageUrl);
    expect(response?.status()).toBeLessThan(400);
  }

  async waitForLoad() {
    await this.page.waitForURL(this.pageUrl, { timeout: 30000 });
    await expect(await this.emptyText.nth(0)).toBeVisible({
      timeout: 30000,
    });
  }
}
