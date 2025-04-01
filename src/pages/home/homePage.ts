import { Page as PlaywrightPage, expect } from "@playwright/test";
import { Page } from "../basePage";
import { Clinic, Specialty } from "../../utils/types";
import { randomIndex } from "../../utils/commonUtils";
import { getAllSpecialtiesByApi } from "../../utils/doctorHelper";

export class HomePage extends Page {
  readonly pageUrl: string;

  constructor(page: PlaywrightPage) {
    super(page);
    this.pageUrl = process.env.HOME_URL || "/";
  }

  // Locators
  specialtiesFrame = this.page.locator(".specialty-content");
  specialtyItems = this.page
    .locator(".specialty-content")
    .locator(".frame-content");
  specialtyImages = this.page
    .locator(".specialty-content")
    .locator(".item-image img")
    .nth(0);
  specialtyTitle = this.page
    .locator(".specialty-content")
    .locator(".item-name");

  clinicsFrame = this.page.locator(".clinic-content");
  clinicItems = this.page.locator(".clinic-content").locator(".swiper-slide");
  clinicImages = this.page
    .locator(".clinic-content")
    .locator(".item-image img")
    .nth(0);
  clinicTitle = this.page.locator(".clinic-content").locator(".item-name");

  doctorsFrame = this.page.locator(".doctor-content");
  doctorItems = this.page.locator(".doctor-content").locator(".frame-content");
  doctorImages = this.page
    .locator(".doctor-content")
    .locator(".item-image img")
    .nth(0);
  doctorTitle = this.page.locator(".doctor-content").locator(".item-name");
  doctorSpecialty = this.page.locator(".doctor-content").locator(".item-title");

  async goto() {
    const response = await this.page.goto(this.pageUrl);
    await expect(response?.status()).toBeLessThan(400);
  }

  async waitForLoad() {
    await this.page.waitForURL(this.pageUrl, { timeout: 30000 });
    await this.specialtyItems.first().isVisible();
  }

  async verifySpecialtyItems(specialties: Specialty[]) {
    const count = await this.specialtyItems.count();
    await expect(count).toBe(specialties.length);
    for (let i = 0; i < count; i++) {
      await expect(this.specialtyTitle.nth(i)).toHaveText(specialties[i].name);
      // await expect(await this.specialtyImages.getAttribute("src")).toContain(
      //   convertBufferToBase64(specialties[i].image)
      // );
    }
    const randomSpecialtyIndex = randomIndex(specialties);
    const detailSpecialtyUrl = `${process.env.DETAIL_SPECIALTY_URL}/${specialties[randomSpecialtyIndex].id}`;
    await this.specialtyItems.nth(randomSpecialtyIndex).click();
    await this.page.waitForURL(detailSpecialtyUrl);
    expect(this.page.url()).toContain(detailSpecialtyUrl);
  }

  async verifyClinicItems(clinics: Clinic[]) {
    //verify count of items
    const count = await this.clinicItems.count();
    await expect(count).toBe(clinics.length);

    //verify title of items
    for (let i = 0; i < count; i++) {
      const clinicTitleItem = this.clinicTitle.nth(i);
      //verify title of content
      await expect(clinicTitleItem).toHaveText(clinics[i].name);

      //verify title of css
      const textAlign = await clinicTitleItem.evaluate((el) => {
        return window.getComputedStyle(el).textAlign;
      });
      const fontSize = await clinicTitleItem.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      const color = await clinicTitleItem.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      await expect(textAlign).toBe("center");
      await expect(fontSize).toBe("18.5px");
      await expect(color).toBe("rgb(44, 62, 80)");

      //verify image
      const clinicImageItem = this.clinicImages.nth(i);
      await expect(clinicImageItem).toBeVisible;
      const boundingBox = await this.clinicImages.boundingBox();
      expect(boundingBox?.height).toBe(215);
      expect(boundingBox?.height).toBeGreaterThan(0);

      //   await expect(await this.clinicImages.getAttribute("src")).toContain(
      //     convertBufferToBase64(clinics[i].image)
      //   );
    }

    // verify url after clicking each item
    const randomClinicIndex = randomIndex(clinics);
    const detailClinicUrl = `${process.env.DETAIL_CLINIC_URL}/${clinics[randomClinicIndex].id}`;
    await this.clinicItems.nth(randomClinicIndex).click();
    await this.page.waitForURL(detailClinicUrl);
    expect(this.page.url()).toContain(detailClinicUrl);
  }

  async verifyTopDoctorsItems(doctors: any[]) {
    //verify count of items
    const count = await this.doctorItems.count();
    await expect(count).toBe(doctors.length);

    //verify title of items
    for (let i = 0; i < count; i++) {
      const doctorTitleItem = this.doctorTitle.nth(i);
      //verify title of content
      const doctorTitle = `${doctors[i].positionData.valueVi}, ${doctors[i].firstName} ${doctors[i].lastName}`;
      const doctorSpecialtyId: string = doctors[i].detailData
        ? `${doctors[i].detailData.specialtyId}`
        : "";
      const doctorSpecialtyData = doctorSpecialtyId
        ? await getAllSpecialtiesByApi(doctorSpecialtyId)
        : "";
      const doctorSpecialtyTitle = doctorSpecialtyData
        ? doctorSpecialtyData[0].name
        : "";
      await expect(doctorTitleItem).toHaveText(doctorTitle);
      await expect(this.doctorSpecialty.nth(i)).toHaveText(
        doctorSpecialtyTitle
      );
    }

    // verify url after clicking each item
    const randomDoctorIndex = randomIndex(doctors);
    const detailDoctorUrl = `${process.env.DETAIL_DOCTOR_URL}/${doctors[randomDoctorIndex].id}`;
    console.log("check detail doctor url: ", detailDoctorUrl);
    await this.doctorItems.nth(randomDoctorIndex).click();
    await this.page.waitForURL(detailDoctorUrl);
    expect(this.page.url()).toContain(detailDoctorUrl);
  }
}
