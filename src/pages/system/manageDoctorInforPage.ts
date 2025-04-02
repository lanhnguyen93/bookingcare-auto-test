import { Page as PlaywrightPage, expect } from "@playwright/test";
import { Page } from "../basePage";
import {
  Allcode,
  AllcodeArray,
  Clinic,
  Specialty,
  User,
} from "../../utils/types";
import { DoctorInforDataType } from "../../tests/testData/doctorInforData";
import {
  getAllClinicsByApi,
  getAllDoctorByApi,
  getAllSpecialtiesByApi,
  getDetailDoctorByDoctorIdByApi,
} from "../../utils/doctorHelper";

export class ManageDoctorInforPage extends Page {
  readonly pageUrl: string;

  constructor(page: PlaywrightPage) {
    super(page);
    this.pageUrl = process.env.MANAGE_DOCTOR_INFOR_URL || "/";
  }

  // Locators
  doctorInforFrame = this.page.locator(".manage-doctor-container");
  pageTitle = this.page.locator(".manage-doctor-title");
  doctorLoadingIndicator = this.page
    .locator(".content-doctor-name")
    .getByText("Loading...");
  doctorCombobox = this.page
    .locator(".content-doctor-name")
    .locator(".vs__selected-options");
  doctorItems = this.page
    .locator(".content-doctor-name")
    .locator("li[role=option]");
  clinicCombobox = this.page
    .locator(".content-clinic")
    .locator(".vs__selected-options");
  clinicItems = this.page.locator(".content-clinic").locator("li[role=option]");
  specialtyCombobox = this.page
    .locator(".content-specialty")
    .locator(".vs__selected-options");
  specialtyItems = this.page
    .locator(".content-specialty")
    .locator("li[role=option]");
  priceCombobox = this.page.locator(".content-price").getByRole("combobox");
  priceOptions = this.page.locator(".content-price select").locator("option");
  paymentCombobox = this.page.locator(".content-payment").getByRole("combobox");
  paymenOptions = this.page
    .locator(".content-payment select")
    .locator("option");
  description = this.page.locator(".content-right").getByRole("textbox");
  note = this.page.locator(".content-note").getByRole("textbox");
  content = this.page.locator(".markdown-content").getByRole("textbox");
  doctorClearButton = this.page
    .locator(".content-doctor-name")
    .getByRole("button");
  clinicClearButton = this.page.locator(".content-clinic").getByRole("button");
  specialtyClearButton = this.page
    .locator(".content-specialty")
    .getByRole("button");
  saveButton = this.page.locator("button[type=submit]");

  async goto() {
    const response = await this.page.goto(this.pageUrl);
    await expect(response?.status()).toBeLessThan(400);
  }

  async waitForLoad() {
    await this.page.waitForURL(this.pageUrl, { timeout: 30000 });
    await this.saveButton.waitFor({ state: "visible" });
  }

  async verifyContentInDoctorList(doctors: User[]) {
    const count = await this.doctorItems.count();
    await expect(count).toEqual(doctors.length);
    for (let i = 0; i < doctors.length; i++) {
      await expect(this.doctorItems.nth(i)).toHaveText(
        `${doctors[i].firstName} ${doctors[i].lastName}`
      );
    }
  }

  async verifyContentInClinicList(clinics: Clinic[]) {
    const count = await this.clinicItems.count();
    await expect(count).toEqual(clinics.length);
    for (let i = 0; i < clinics.length; i++) {
      await expect(await this.clinicItems.nth(i)).toHaveText(clinics[i].name);
    }
  }

  async verifyContentInSpecialtyList(specialties: Specialty[]) {
    const count = await this.specialtyItems.count();
    await expect(count).toEqual(specialties.length);
    for (let i = 0; i < specialties.length; i++) {
      await expect(await this.specialtyItems.nth(i)).toHaveText(
        specialties[i].name
      );
    }
  }

  async verifyPriceContentInList(prices: AllcodeArray[]) {
    const count = await this.priceOptions.count();
    await expect(count).toEqual(prices.length);
    for (let i = 0; i < prices.length; i++) {
      await expect(await this.priceOptions.nth(i)).toHaveText(
        prices[i].valueVi
      );
    }
  }

  async verifyPaymentContentInList(payments: AllcodeArray[]) {
    const count = await this.paymenOptions.count();
    await expect(count).toEqual(payments.length);
    for (let i = 0; i < payments.length; i++) {
      await expect(await this.paymenOptions.nth(i)).toHaveText(
        payments[i].valueVi
      );
    }
  }

  async fillForm(doctorInforData: DoctorInforDataType) {
    await this.selectDoctorByDoctorId(doctorInforData.doctorId);
    await this.selectClinicByClinicId(doctorInforData.clinicId);
    await this.selectSpecialtyBySpecialtyId(doctorInforData.specialtyId);
    await this.priceCombobox.click();
    await this.priceCombobox.selectOption(doctorInforData.priceId);
    await this.paymentCombobox.click();
    await this.paymentCombobox.selectOption(doctorInforData.paymentId);
    await this.description.fill(doctorInforData.description);
    await this.note.fill(doctorInforData.note);
    await this.content.fill(doctorInforData.contentMarkdown);
  }

  async verifyFormByDoctorId(doctorId: string) {
    const doctors = await getAllDoctorByApi();
    const doctor = doctors.find((doctor: User) => doctor.id === doctorId);
    const doctorInfor = await getDetailDoctorByDoctorIdByApi(doctorId);
    await expect(this.doctorCombobox).toHaveText(
      `${doctor.firstName} ${doctor.lastName}`
    );
    await expect(this.priceCombobox).toHaveValue(doctorInfor.priceId);
    await expect(this.paymentCombobox).toHaveValue(doctorInfor.paymentId);
    await expect(this.clinicCombobox).toHaveText(doctorInfor.clinicData.name);
    await expect(this.specialtyCombobox).toHaveText(
      doctorInfor.specialtyData.name
    );
    await expect(this.description).toHaveValue(doctorInfor.description);
    await expect(this.note).toHaveValue(doctorInfor.note);
    await expect(this.content).toHaveValue(doctorInfor.contentMarkdown);
    await expect(this.saveButton).toBeVisible;
  }

  async verifyEmptyForm() {
    await expect(this.doctorCombobox).toHaveText("");
    await expect(this.priceCombobox).toHaveValue("");
    await expect(this.paymentCombobox).toHaveValue("");
    await expect(this.clinicCombobox).toHaveText("");
    await expect(this.specialtyCombobox).toHaveText("");
    await expect(this.description).toHaveText("");
    await expect(this.note).toHaveText("");
    await expect(this.content).toHaveText("");
    await expect(this.saveButton).toBeVisible;
  }

  async isEmptyForm() {
    const doctor = await this.doctorCombobox.textContent();
    const price = await this.priceCombobox.inputValue();
    const payment = await this.paymentCombobox.inputValue();
    const clinic = await this.clinicCombobox.textContent();
    const specialty = await this.specialtyCombobox.textContent();
    const description = await this.description.textContent();
    const note = await this.note.textContent();
    const content = await this.content.textContent();
    if (
      !doctor &&
      !price &&
      !payment &&
      !clinic &&
      !specialty &&
      !description &&
      !note &&
      !content
    ) {
      return true;
    } else return false;
  }

  async verifyAlertMessage(msg: string) {
    this.page.on("dialog", async (dialog) => {
      await expect(await dialog.message()).toBe(msg);
      await dialog.accept();
    });
  }

  async selectDoctorByDoctorId(doctorId: string) {
    const doctors = await getAllDoctorByApi();
    const doctor = doctors.find((doctor: User) => doctor.id === doctorId);
    const fullname = `${doctor.firstName} ${doctor.lastName}`;
    await this.doctorCombobox.click();
    await this.doctorItems.getByText(fullname, { exact: true }).click();
  }

  async selectClinicByClinicId(clinicId: string) {
    const clinics = await getAllClinicsByApi();
    const clinic = clinics.find((clinic: Clinic) => clinic.id === clinicId);
    await this.clinicCombobox.click();
    await this.clinicItems.getByText(clinic.name, { exact: true }).click();
  }

  async selectSpecialtyBySpecialtyId(specialtyId: string) {
    const specialties = await getAllSpecialtiesByApi();
    const specialty = specialties.find(
      (specialty: Specialty) => specialty.id === specialtyId
    );
    await this.specialtyCombobox.click();
    await this.specialtyItems
      .getByText(specialty.name, { exact: true })
      .click();
  }
}
