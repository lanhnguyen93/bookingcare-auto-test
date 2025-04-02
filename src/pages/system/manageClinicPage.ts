import { Page as PlaywrightPage, expect } from "@playwright/test";
import { Page } from "../basePage";
import path from "path";
import { Clinic } from "../../utils/types";
import { convertBufferToBase64 } from "../../utils/commonUtils";
import { ClinicDataType } from "../../tests/testData/clinicData";

export class ManageClinicPage extends Page {
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
    this.pageUrl = process.env.MANAGE_CLINIC_URL || "/";
  }

  // Locators
  clinicFrame = this.page.locator(".clinic-content");
  clinicCombobox = this.page.locator(".all-clinic").getByRole("combobox");
  clinicItems = this.page.locator(".all-clinic").locator("li[role=option]");
  clinicName = this.page.locator(".content-top").locator("input");
  clinicProvince = this.page.locator(".content-top").getByRole("combobox");
  clinicImage = this.page.locator(".content-right").locator("input");
  clinicImagePreview = this.page.locator(".content-right").locator("img");
  clinicAddress = this.page.locator(".content-bottom input");
  clinicDescription = this.page.locator(".markdown-content textarea");
  submitButton = this.page.locator("button[type=submit]");
  deleteButton = this.page.getByRole("button", { name: "Delete" });
  clearButton = this.page.locator(".all-clinic").getByRole("button");

  async goto() {
    const response = await this.page.goto(this.pageUrl);
    await expect(response?.status()).toBeLessThan(400);
  }

  async waitForLoad() {
    await this.page.waitForURL(this.pageUrl, { timeout: 30000 });
    await this.submitButton.waitFor({ state: "visible" });
  }

  async verifyContentInList(clinics: Clinic[]) {
    const count = await this.clinicItems.count();
    await expect(count).toEqual(clinics.length);
    for (let i = 0; i < clinics.length; i++) {
      await expect(await this.clinicItems.nth(i).textContent()).toBe(
        clinics[i].name
      );
    }
  }

  async fillForm(clinicData: ClinicDataType, isEdit: boolean) {
    const imagePath = isEdit ? this.editImagePath : this.imagePath;
    await this.clinicName.fill(clinicData.name);
    await this.clinicProvince.click();
    await this.clinicProvince.selectOption(clinicData.provinceId);
    await this.clinicImage.setInputFiles(imagePath);
    await this.clinicAddress.fill(clinicData.address);
    await this.clinicDescription.fill(clinicData.descriptionMarkdown);
  }

  async verifyForm(clinic: ClinicDataType, isEdit: boolean) {
    await expect(this.clinicName).toHaveValue(clinic.name);
    await expect(this.clinicProvince).toHaveValue(clinic.provinceId);
    await expect(this.clinicAddress).toHaveValue(clinic.address);
    await expect(this.clinicDescription).toHaveValue(
      clinic.descriptionMarkdown
    );
    await expect(this.submitButton).toBeVisible;
    if (isEdit) {
      await expect(this.deleteButton).toBeVisible;
    } else await expect(this.deleteButton).toBeHidden;
    const imageValue = await this.imagePath.split("testData/")[1];
    if (clinic.image) {
      if (isEdit) {
        const imageBase64 = convertBufferToBase64(clinic.image);
        await expect(
          await this.clinicImagePreview.getAttribute("src")
        ).toContain(imageBase64);
      } else {
        await expect(await this.clinicImage.inputValue()).toContain(imageValue);
      }
    } else {
      await await expect(this.clinicImage).toHaveValue("");
      await expect(this.clinicImagePreview).toBeHidden;
    }
  }

  async verifyAlertMessage(msg: string) {
    this.page.on("dialog", async (dialog) => {
      await expect(await dialog.message()).toBe(msg);
      await dialog.accept();
    });
  }
}
