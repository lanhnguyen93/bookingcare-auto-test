import { Locator, Page as PlaywrightPage, expect } from "@playwright/test";
import { Page } from "../basePage";
import { getAllUserByApi } from "../../utils/userHelper";
import { getToken } from "../../utils/commonUtils";
import { getDetailDoctorByIdByApi } from "../../utils/doctorHelper";
import { Schedule } from "../../utils/types";

export class DetailDoctorPage extends Page {
  readonly pageUrl: string;

  constructor(page: PlaywrightPage, doctorId: string) {
    super(page);
    this.pageUrl = `${process.env.DETAIL_DOCTOR_URL || "/"}/${doctorId}`;
  }

  // Locators
  detailDoctorFrame = this.page.locator(".detail-doctor-container");
  detailPaymentFrame = this.page.locator(".detail-info");
  detaiDoctor = this.page.locator(".doctor-header");
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
  seeMoreButton = this.page.getByRole("button", { name: " Xem chi tiết " });
  hideButton = this.page.getByRole("button", { name: " Ẩn chi tiết " });
  calendar = this.page.locator(".schedule-date");
  timeblocks = this.page.locator(".time-block-item");
  emptyTime = this.page.locator(".empty-time");

  introDoctor = this.page.locator(".doctor-detail-content");

  async goto() {
    const response = await this.page.goto(this.pageUrl);
    await expect(response?.status()).toBeLessThan(400);
  }

  async waitForLoad() {
    await this.page.waitForURL(this.pageUrl, { timeout: 30000 });
    await this.introDoctor.isVisible();
  }

  async verifyDoctorInfor(doctoId: string) {
    const doctor = await getDetailDoctorByIdByApi(doctoId);

    // verify doctor title
    await expect(this.doctorTitle).toHaveText(
      `${doctor.positionData.valueVi}, ${doctor.firstName} ${doctor.lastName}`
    );

    //verify doctor address
    await expect(this.doctorAddress).toHaveText(doctor.address);

    //verify doctor image
    const imageWidth = await this.doctorImage.evaluate((el) => {
      return window.getComputedStyle(el).width;
    });
    const imageHeight = await this.doctorImage.evaluate((el) => {
      return window.getComputedStyle(el).height;
    });
    const imageBorderRadius = await this.doctorImage.evaluate((el) => {
      return window.getComputedStyle(el).borderRadius;
    });
    await expect(imageWidth).toBe("150px");
    await expect(imageHeight).toBe("150px");
    await expect(imageBorderRadius).toBe("50%");
  }

  async verifyIntroContent(contentHMTL: string) {
    const introHTMLContent = await this.introDoctor.evaluate((element) => {
      return element.innerHTML;
    });
    await expect(introHTMLContent).toBe(contentHMTL);
  }

  async verifyClinicContent(clinicData: any) {
    await expect(this.clinicName).toHaveText(clinicData.name);
    await expect(this.clinicAddress).toHaveText(clinicData.address);

    const nameFontSize = await this.clinicName.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
    const nameFontWeight = await this.clinicName.evaluate((el) => {
      return window.getComputedStyle(el).fontWeight;
    });
    const addressFontSize = await this.clinicAddress.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
    const addressFontWeight = await this.clinicAddress.evaluate((el) => {
      return window.getComputedStyle(el).fontWeight;
    });
    await expect(nameFontSize).toBe("13px");
    await expect(nameFontWeight).toBe("700");
    await expect(addressFontSize).toBe("13px");
    await expect(addressFontWeight).toBe("400");
  }

  async verifyPriceContent(priceData: any) {
    //verify initial state
    await expect(this.price).toBeVisible;
    await expect(this.seeMoreButton).toBeVisible;
    await expect(this.detailPrice).toBeHidden;
    await expect(this.hideButton).toBeHidden;
    await expect(this.price).toHaveText(priceData.valueVi);

    // verify detail price
    await this.seeMoreButton.click();
    await expect(this.price).toBeHidden;
    await expect(this.seeMoreButton).toBeHidden;
    await expect(this.detailPrice).toBeVisible;
    await expect(this.hideButton).toBeVisible;
    await expect(this.detailNote).toHaveText(
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
