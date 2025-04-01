import { expect, test } from "../../../../fixtures/base-test";
import { DetailDoctorPage } from "../../../../pages/home/detailDoctorPage";
import {
  getRandomDateFromToday,
  getToken,
} from "../../../../utils/commonUtils";
import {
  createSchedulesByApi,
  deleteScheduleByApi,
} from "../../../../utils/doctorHelper";
import { Schedule, User } from "../../../../utils/types";
import { createUserByApi, deleteUserByApi } from "../../../../utils/userHelper";

let doctor: User;
let schedules: Schedule[];
let scheduleDate: string;

test.describe("Verify Schedule", () => {
  test.beforeAll(async ({ authToken }) => {
    doctor = await createUserByApi(getToken(), "Doctor");
    scheduleDate = await getRandomDateFromToday();
    schedules = await createSchedulesByApi(getToken(), doctor.id, scheduleDate);
  });

  test.beforeEach(async ({ page }) => {
    const detailDoctorPage = new DetailDoctorPage(page, doctor.id);
    await detailDoctorPage.goto();
    await detailDoctorPage.waitForLoad();
  });

  test.afterAll(async () => {
    await deleteUserByApi(getToken(), doctor.id);
    await deleteScheduleByApi(getToken(), doctor.id, scheduleDate);
  });

  test("should displayed calendar correctly", async ({ page }) => {
    const detailDoctorPage = new DetailDoctorPage(page, doctor.id);

    //default display today
    const today = new Date();
    let formattedToday = today.toISOString().split("T")[0];
    await expect(detailDoctorPage.calendar).toHaveValue(formattedToday);

    //can select the future date
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    let formattedTomorrow = tomorrow.toISOString().split("T")[0];
    await detailDoctorPage.calendar.fill(formattedTomorrow);
    await expect(detailDoctorPage.calendar).toHaveValue(formattedTomorrow);

    //can not select the past date
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    let formattedYesterday = yesterday.toISOString().split("T")[0];
    await detailDoctorPage.calendar.fill(formattedYesterday);
    await expect(detailDoctorPage.calendar).toHaveValue(formattedToday);
  });

  test("should display schedule by date correctly", async ({ page }) => {
    const detailDoctorPage = new DetailDoctorPage(page, doctor.id);

    // verify when have schedules
    await detailDoctorPage.calendar.fill(scheduleDate);
    await page.waitForTimeout(500);
    await detailDoctorPage.verifyTimeblock(schedules);
    await expect(detailDoctorPage.emptyTime).toBeHidden;

    // verify when no schedules
    let emptyDate = new Date(schedules[0].date);
    emptyDate.setDate(emptyDate.getDate() + 1);
    let formattedEmptyDate = emptyDate.toISOString().split("T")[0];
    await detailDoctorPage.calendar.fill(formattedEmptyDate);
    await expect(detailDoctorPage.emptyTime).toBeVisible;
    await expect(detailDoctorPage.timeblocks).toBeHidden;
  });
});
