import { test, expect } from "../../../../fixtures/base-test";
import { DetailSpecialtyPage } from "../../../../pages/home/detailSpecialtyPage";
import {
  getAllcode,
  getRandomDateFromToday,
  getToken,
} from "../../../../utils/commonUtils";
import {
  createSchedulesByApi,
  deleteScheduleByApi,
  getDetailDoctorByDoctorIdByApi,
  getDetailDoctorBySpecialtyIdAndProvinceIdByAPI,
} from "../../../../utils/doctorHelper";
import { Schedule } from "../../../../utils/types";

let specialtyId: string;
let doctorId: string;
let scheduleDate: string;
let schedules: Schedule[];

test("should display doctors correctly by province", async ({ page }) => {
  specialtyId = process.env.SPECIALTY_ID ? process.env.SPECIALTY_ID : "1";
  const provinces = await getAllcode("PROVINCE");
  const provinceKeys = ["ALL", ...provinces.map((province) => province.key)];
  const provinceValues = [
    "Toàn quốc",
    ...provinces.map((province) => province.valueVi),
  ];

  const detailSpecialtyPage = new DetailSpecialtyPage(page, specialtyId);
  // Go to Home Page
  await detailSpecialtyPage.goto();
  await detailSpecialtyPage.waitForLoad();

  //verify display select btn
  await detailSpecialtyPage.verifyDisplaySelectProvinceButton(
    provinceKeys,
    provinceValues
  );

  //verify filter doctor by province
  for (let j = 0; j < provinces.length; j++) {
    const doctors = await getDetailDoctorBySpecialtyIdAndProvinceIdByAPI(
      specialtyId,
      provinceKeys[j]
    );
    await detailSpecialtyPage.selectProvince.selectOption(provinceKeys[j]);
    await page.waitForTimeout(500);
    if (doctors) {
      await expect(detailSpecialtyPage.emptyText).toBeHidden;
      await expect(await detailSpecialtyPage.doctorInfors.count()).toBe(
        doctors.length
      );
    } else {
      await expect(detailSpecialtyPage.emptyText).toBeVisible;
    }
  }
});

test.describe("Doctor Content", () => {
  test.beforeEach(async ({ page }) => {
    specialtyId = process.env.SPECIALTY_ID ? process.env.SPECIALTY_ID : "1";
    doctorId = process.env.DOCTOR_ID ? process.env.DOCTOR_ID : "3";

    const detailSpecialtyPage = new DetailSpecialtyPage(page, specialtyId);
    // Go to Home Page
    await detailSpecialtyPage.goto();
    await detailSpecialtyPage.waitForLoad();
  });

  test("should display common doctor infor correctly", async ({ page }) => {
    const doctorInfor = await getDetailDoctorByDoctorIdByApi(doctorId);
    const detailSpecialtyPage = new DetailSpecialtyPage(page, specialtyId);

    //verify doctor infor: title, address, image
    await detailSpecialtyPage.verifyDoctorInfor(doctorId);

    //verify doctor description
    await expect(detailSpecialtyPage.doctorDescription.first()).toHaveText(
      doctorInfor.description
    );
  });

  test("should display booking infor correctly", async ({ page }) => {
    const doctorInfor = await getDetailDoctorByDoctorIdByApi(doctorId);
    const detailSpecialtyPage = new DetailSpecialtyPage(page, specialtyId);

    // verify clinic infor
    await detailSpecialtyPage.verifyClinicContent(doctorInfor.clinicData);

    // verify payment infor
    await expect(detailSpecialtyPage.payment.first()).toHaveText(
      doctorInfor.paymentData.valueVi
    );

    // verify price infor
    await detailSpecialtyPage.verifyPriceContent(doctorInfor.priceData);
  });
});

test.describe("Doctor Schedule", () => {
  test.beforeAll(async ({ authToken }) => {
    specialtyId = process.env.SPECIALTY_ID ? process.env.SPECIALTY_ID : "1";
    doctorId = process.env.DOCTOR_ID ? process.env.DOCTOR_ID : "3";
    scheduleDate = await getRandomDateFromToday();
    schedules = await createSchedulesByApi(getToken(), doctorId, scheduleDate);
    console.log("check schedules: ", schedules);
  });

  test.beforeEach(async ({ page }) => {
    const detailSpecialtyPage = new DetailSpecialtyPage(page, specialtyId);
    await detailSpecialtyPage.goto();
    await detailSpecialtyPage.waitForLoad();
  });

  test.afterAll(async () => {
    await deleteScheduleByApi(getToken(), doctorId, scheduleDate);
  });

  test("should displayed calendar correctly", async ({ page }) => {
    const detailSpecialtyPage = new DetailSpecialtyPage(page, specialtyId);

    //default display today
    const today = new Date();
    let formattedToday = today.toISOString().split("T")[0];
    await expect(detailSpecialtyPage.calendar.first()).toHaveValue(
      formattedToday
    );

    //can select the future date
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    let formattedTomorrow = tomorrow.toISOString().split("T")[0];
    await detailSpecialtyPage.calendar.first().fill(formattedTomorrow);
    await expect(detailSpecialtyPage.calendar.first()).toHaveValue(
      formattedTomorrow
    );

    //can not select the past date
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    let formattedYesterday = yesterday.toISOString().split("T")[0];
    await detailSpecialtyPage.calendar.first().fill(formattedYesterday);
    await expect(detailSpecialtyPage.calendar.first()).toHaveValue(
      formattedToday
    );
  });

  test("should display schedule by date correctly", async ({ page }) => {
    const detailSpecialtyPage = new DetailSpecialtyPage(page, specialtyId);

    // verify when no schedules
    let emptyDate = new Date(schedules[0].date);
    emptyDate.setDate(emptyDate.getDate() + 1);
    let formattedEmptyDate = emptyDate.toISOString().split("T")[0];
    await detailSpecialtyPage.calendar.first().fill(formattedEmptyDate);
    await expect(detailSpecialtyPage.emptyTime.first()).toBeVisible;
    await expect(detailSpecialtyPage.timeblocks.first()).toBeHidden;

    // verify when have schedules
    await detailSpecialtyPage.calendar.first().fill(scheduleDate);
    await page.waitForTimeout(500);
    await detailSpecialtyPage.verifyTimeblock(schedules);
    await expect(detailSpecialtyPage.emptyTime.first()).toBeHidden;
  });

  test("should navigate booking page when clicking a schedule", async ({
    page,
  }) => {
    const detailSpecialtyPage = new DetailSpecialtyPage(page, specialtyId);

    await detailSpecialtyPage.calendar.first().fill(scheduleDate);
    await page.waitForTimeout(500);

    const timeType = await detailSpecialtyPage.timeblocks
      .first()
      .first()
      .getAttribute("value");
    const bookingUrl = `${process.env
      .BOOKING_URL!}/${doctorId}/${scheduleDate}/${timeType}`;

    await detailSpecialtyPage.timeblocks.first().first().click();
    await page.waitForURL(bookingUrl, { timeout: 30000 });
  });
});
