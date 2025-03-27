import { Page as PlaywrightPage, expect } from "@playwright/test";
import { Page } from "../basePage";
import { SpecialtyDataType } from "../../tests/testData/specialtyData";
import path from "path";
import { Specialty } from "../../utils/types";
import { convertBufferToBase64 } from "../../utils/commonUtils";

export class SpecialtyPage extends Page {
  readonly pageUrl: string;
  private imagePath = path.resolve(
    __dirname,
    "../../tests/testData/image-add-new.png"
  );
  private editImagePath = path.resolve(
    __dirname,
    "../../tests/testData/image-edit.png"
  );

  constructor(page: PlaywrightPage) {
    super(page);
    this.pageUrl = process.env.SPECIALTY_URL || "/";
  }

  // Locators
  specialtyCombobox = this.page.getByRole("combobox");
  specialtyItems = this.page.locator("li[role=option]");
  specialtyName = this.page.locator(".content-left input");
  specialtyImage = this.page.locator(".content-right input");
  specialtyImagePreview = this.page.locator(".img-preview");
  specialtyDescription = this.page.locator(".markdown-content textarea");
  submitButton = this.page.locator("button[type=submit]");
  deleteButton = this.page.getByRole("button", { name: "Delete" });

  async goto() {
    const response = await this.page.goto(this.pageUrl);
    await expect(response?.status()).toBeLessThan(400);
  }

  async waitForLoad() {
    await this.page.waitForURL(this.pageUrl, { timeout: 30000 });
    await this.submitButton.waitFor({ state: "visible" });
  }

  async verifyContentInList(specialties: Specialty[]) {
    const count = await this.specialtyItems.count();
    await expect(count).toEqual(specialties.length);
    for (let i = 0; i < specialties.length; i++) {
      await expect(await this.specialtyItems.nth(i).textContent()).toBe(
        specialties[i].name
      );
    }
  }

  async fillForm(specialtyData: SpecialtyDataType, isEdit: boolean) {
    const imagePath = isEdit ? this.editImagePath : this.imagePath;
    await this.specialtyName.fill(specialtyData.name);
    await this.specialtyImage.setInputFiles(imagePath);
    await this.specialtyDescription.fill(specialtyData.descriptionMarkdown);
  }

  async verifyAddnewForm(specialty: SpecialtyDataType) {
    const imageValue = await this.imagePath.split("testData/")[1];
    await expect(this.specialtyName).toHaveValue(specialty.name);
    await expect(this.specialtyDescription).toHaveValue(
      specialty.descriptionMarkdown
    );
    if (specialty.image) {
      await expect(await this.specialtyImage.inputValue()).toContain(
        imageValue
      );
    } else {
      await expect(await this.specialtyImage.inputValue()).toBe("");
    }
    await expect(this.submitButton).toBeVisible;
    await expect(this.deleteButton).toBeHidden;
  }

  async verifyEditForm(specialty: SpecialtyDataType) {
    await expect(this.specialtyName).toHaveValue(specialty.name);
    await expect(this.specialtyDescription).toHaveValue(
      specialty.descriptionMarkdown
    );
    const imageBase64 = convertBufferToBase64(specialty.image);
    await expect(
      await this.specialtyImagePreview.getAttribute("src")
    ).toContain(imageBase64);
    await expect(this.submitButton).toBeVisible;
    await expect(this.deleteButton).toBeVisible;
  }

  async clickSpecialtyItem(name: string) {
    this.page
      .locator("li[role=option]")
      .getByText(name, { exact: true })
      .click();
  }

  async verifyAlertMessage(msg: string) {
    this.page.on("dialog", async (dialog) => {
      await expect(await dialog.message()).toBe(msg);
      await dialog.accept();
    });
  }
}
