import { Page as PlaywrightPage, expect } from "@playwright/test";
import { Page } from "../basePage";
import {
  getAllSpecialtiesByApi,
  getDetailDoctorByIdByApi,
} from "../../utils/doctorHelper";
import { Schedule } from "../../utils/types";

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

  doctorImage = this.page.locator(".image");
  doctorTitle = this.page.locator(".title");
  doctorDescription = this.page.locator(".description");
  doctorAddress = this.page.locator(".address");
  clinicName = this.page.locator(".clinic-name");
  clinicAddress = this.page.locator(".clinic-address");
  payment = this.page.locator(".payment-info");
  price = this.page.locator(".price-infor");
  detailPrice = this.page.locator(".detail-price");
  detailNote = this.page.locator(".detail-note");
  doctorSeeMoreButton = this.page
    .locator(".content-bottom")
    .getByRole("button", { name: " Xem chi tiết " });
  hideButton = this.page
    .locator(".content-bottom")
    .getByRole("button", { name: " Ẩn chi tiết " });
  calendar = this.page.locator(".schedule-date");
  timeblocks = this.page.locator(".time-block-item");
  emptyTime = this.page.locator(".empty-time");

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

  async verifyDoctorInfor(doctoId: string) {
    const doctor = await getDetailDoctorByIdByApi(doctoId);

    // verify doctor title
    await expect(await this.doctorTitle.first()).toHaveText(
      `${doctor.positionData.valueVi}, ${doctor.firstName} ${doctor.lastName}`
    );

    //verify doctor address
    await expect(await this.doctorAddress.first()).toHaveText(doctor.address);

    //verify doctor image
    const imageWidth = await this.doctorImage.first().evaluate((el) => {
      return window.getComputedStyle(el).width;
    });
    const imageHeight = await this.doctorImage.first().evaluate((el) => {
      return window.getComputedStyle(el).height;
    });
    const imageBorderRadius = await this.doctorImage.first().evaluate((el) => {
      return window.getComputedStyle(el).borderRadius;
    });
    await expect(imageWidth).toBe("150px");
    await expect(imageHeight).toBe("150px");
    await expect(imageBorderRadius).toBe("50%");
  }

  async verifyClinicContent(clinicData: any) {
    await expect(this.clinicName.first()).toHaveText(clinicData.name);
    await expect(this.clinicAddress.first()).toHaveText(clinicData.address);

    const nameFontSize = await this.clinicName.first().evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
    const nameFontWeight = await this.clinicName.first().evaluate((el) => {
      return window.getComputedStyle(el).fontWeight;
    });
    const addressFontSize = await this.clinicAddress.first().evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
    const addressFontWeight = await this.clinicAddress
      .first()
      .evaluate((el) => {
        return window.getComputedStyle(el).fontWeight;
      });
    await expect(nameFontSize).toBe("13px");
    await expect(nameFontWeight).toBe("700");
    await expect(addressFontSize).toBe("13px");
    await expect(addressFontWeight).toBe("400");
  }

  async verifyPriceContent(priceData: any) {
    //verify initial state
    await expect(this.price.first()).toBeVisible;
    await expect(this.seeMoreButton.first()).toBeVisible;
    await expect(this.detailPrice.first()).toBeHidden;
    await expect(this.hideButton.first()).toBeHidden;
    await expect(this.price.first()).toHaveText(priceData.valueVi);

    // verify detail price
    await this.doctorSeeMoreButton.first().click();
    await expect(this.price.first()).toBeHidden;
    await expect(this.seeMoreButton.first()).toBeHidden;
    await expect(this.detailPrice.first()).toBeVisible;
    await expect(this.hideButton.first()).toBeVisible;
    await expect(this.detailNote.first()).toHaveText(
      " Phòng khám có hình thức thanh toán chi phí bằng tiền mặt "
    );
  }

  async verifyTimeblock(schedules: Schedule[]) {
    let count = await this.timeblocks.count();
    await expect(count).toBe(schedules.length);

    // get timeType list from schedules
    const scheduleTimeTypes = schedules.map((schedule) => schedule.timeType);
    const sortedScheduleTimeTypes = scheduleTimeTypes.sort();

    //compare time-block value
    for (let i = 0; i < count; i++) {
      await expect(await this.timeblocks.nth(i).getAttribute("value")).toBe(
        sortedScheduleTimeTypes[i]
      );
    }
  }
}
