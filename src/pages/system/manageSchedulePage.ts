import { Locator, Page as PlaywrightPage, expect } from "@playwright/test";
import { Page } from "../basePage";
import { da } from "@faker-js/faker";
import { User } from "../../utils/types";
import { getAllcode } from "../../utils/commonUtils";
import { getAllDoctorByApi } from "../../utils/doctorHelper";
import { ScheduleDataType } from "../../tests/testData/schedulesData";

export class ManageSchedulePage extends Page {
  readonly pageUrl: string;

  constructor(page: PlaywrightPage) {
    super(page);
    this.pageUrl = process.env.MANAGE_SCHEDULE_URL || "/";
  }

  //Locators
  pageTitle = this.page.locator(".manage-schedule-title");
  doctorCombobox = this.page
    .locator(".content-left")
    .locator(".vs__selected-options");
  doctorItems = this.page.locator(".content-left").locator("li[role=option]");
  doctorClearButton = this.page.locator(".content-left").getByRole("button");
  timeBlockItems = this.page.locator(".time-block-item");
  dateField = this.page.locator(".content-right input");
  saveButton = this.page.locator("button[type=submit]");

  async goto() {
    const response = await this.page.goto(this.pageUrl);
    expect(response?.status()).toBeLessThan(400);
  }

  async waitForLoad() {
    await this.page.waitForURL(this.pageUrl, { timeout: 30000 });
    await expect(await this.timeBlockItems.nth(0)).toBeVisible({
      timeout: 30000,
    });
  }

  async fillForm(schedulesData: ScheduleDataType[]) {
    await this.selectTimeBlocks(schedulesData);
    await this.selectDoctorByDoctorId(schedulesData[0].doctorId);
    await this.dateField.fill(schedulesData[0].date);
  }

  async selectTimeBlocks(schedulesData: ScheduleDataType[]) {
    await schedulesData.forEach(async (scheduleData: ScheduleDataType) => {
      await this.page
        .locator(`.time-block-item[value=${scheduleData.timeType}]`)
        .click({ force: true });
    });
  }

  async isEmptyForm() {
    const doctor = await this.doctorCombobox.textContent();
    const date = await this.dateField.inputValue();
    const isSelectedTimeBlocks = await this.areAllTimeBlocksSelected();
    return !doctor && !date && !isSelectedTimeBlocks;
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

  async verifyTimeblockItems() {
    const timeblocks = await getAllcode("TIME");
    const count = await this.timeBlockItems.count();
    await expect(count).toBe(timeblocks.length);
    for (let i = 0; i < count; i++) {
      await expect(this.timeBlockItems.nth(i)).toHaveText(
        timeblocks[i].valueVi
      );
    }
  }

  async areAllTimeBlocksSelected(): Promise<boolean> {
    const count = await this.timeBlockItems.count();
    for (let i = 0; i < count; i++) {
      const timeblock = this.timeBlockItems.nth(i);
      const isSelected = await this.isSelectedTimeBlock(timeblock);
      if (isSelected) {
        return true;
      }
    }
    return false;
  }

  async isSelectedTimeBlock(timeblock: Locator) {
    const classAttribute = await timeblock.getAttribute("class");
    return classAttribute?.includes("selected") || false;
  }

  async selectDoctorByDoctorId(doctorId: string) {
    const doctors = await getAllDoctorByApi();
    const doctor = doctors.find((doctor: User) => doctor.id === doctorId);
    const fullname = `${doctor.firstName} ${doctor.lastName}`;
    await this.doctorCombobox.click();
    await this.doctorItems.getByText(fullname, { exact: true }).click();
  }

  async verifyAlertMessage(msg: string) {
    this.page.on("dialog", async (dialog) => {
      await expect(await dialog.message()).toBe(msg);
      await dialog.accept();
    });
  }
}
