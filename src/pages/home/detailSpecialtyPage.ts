import { Page as PlaywrightPage, expect } from "@playwright/test";
import { Page } from "../basePage";
import {
  getAllSpecialtiesByApi,
  getDetailDoctorBySpecialtyIdAndProvinceIdByAPI,
} from "../../utils/doctorHelper";
import { spec } from "node:test/reporters";
import { getAllcode } from "../../utils/commonUtils";

export class DetailSpecialtyPage extends Page {
  readonly pageUrl: string;

  constructor(page: PlaywrightPage, specialtyId: string) {
    super(page);
    this.pageUrl = `${process.env.DETAIL_SPECIALTY_URL || "/"}/${specialtyId}`;
  }

  // Locators
  doctorInforItems = this.page.locator(".doctor-infor");
  specialtyInfor = this.page.locator(".top-content");
  selectProvince = this.page.locator(".select-province select");
  selectionOptions = this.page.locator(".select-province option");
  doctorInfors = this.page.locator(".doctor-infor");

  specialtyTitle = this.page.locator(".title-text");
  specialtyContent = this.page.locator(".item-content");
  seeMoreButton = this.page.locator(".show-more-btn");

  emptyText = this.page.locator(".empty-item");
  detailButtons = this.page.locator(".content-left button");

  async goto() {
    const response = await this.page.goto(this.pageUrl);
    await expect(response?.status()).toBeLessThan(400);
  }

  async waitForLoad() {
    await this.page.waitForURL(this.pageUrl, { timeout: 30000 });
    await this.doctorInforItems.first().isVisible();
  }

  async verifySpecialtyTitle(specialtyId: string) {
    const specialtyInfor = await getAllSpecialtiesByApi(specialtyId);
    await expect(this.specialtyTitle).toHaveText(specialtyInfor.name);
    const textAlign = await this.specialtyTitle.evaluate((el) => {
      return window.getComputedStyle(el).textAlign;
    });
    const fontSize = await this.specialtyTitle.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
    const fontWeight = await this.specialtyTitle.evaluate((el) => {
      return window.getComputedStyle(el).fontWeight;
    });
    await expect(textAlign).toBe("left");
    await expect(fontSize).toBe("20px");
    await expect(fontWeight).toBe("700");
  }

  async verifyTrimmingContent() {
    const trimmingContent = await this.specialtyContent.textContent();
    await expect(this.seeMoreButton).toHaveText("Xem thêm");
    await this.seeMoreButton.click();
    await expect(this.seeMoreButton).toHaveText("Ẩn bớt");
    const fullContent = await this.specialtyContent.textContent();
    if (trimmingContent && fullContent) {
      const trimmedWithoutDots = trimmingContent.replace("...", "");
      expect(fullContent.startsWith(trimmedWithoutDots)).toBeTruthy();
    } else {
      throw new Error("Content is empty or not found!");
    }
  }

  async verifyHTMLContent(specialtyId: string) {
    const specialtyInfor = await getAllSpecialtiesByApi(specialtyId);
    if ((await this.seeMoreButton.textContent()) !== "Ẩn bớt") {
      await this.seeMoreButton.click();
    }
    const specialtyHTMLContent = await this.specialtyContent.evaluate(
      (element) => {
        return element.innerHTML;
      }
    );
    await expect(specialtyHTMLContent).toBe(specialtyInfor.descriptionHTML);
  }

  async verifyDisplaySelectProvinceButton(value: string[], text: string[]) {
    //Check default option
    await expect(this.selectProvince).toHaveValue(value[0]);

    // Verify option of value
    for (let i = 0; i < value.length; i++) {
      await expect(
        await this.selectionOptions.nth(i).getAttribute("value")
      ).toBe(value[i]);
      await expect(this.selectionOptions.nth(i)).toHaveText(text[i]);
    }
  }

  // async verifyDisplayEmptyText(doctors: any[]) {
  //   if (!doctors) {
  //     await expect(this.emptyText).toBeHidden;
  //     console.log("hidden");
  //     //TOdo
  //   } else {
  //     await expect(this.emptyText).toBeVisible();
  //     console.log("visible");
  //   }
  // }
}
