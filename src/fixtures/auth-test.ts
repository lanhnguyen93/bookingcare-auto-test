import { test as base } from "@playwright/test";
import { Page } from "../pages/basePage";
import fs from "fs";
import { api } from "../utils/api";
import { createUserByApi } from "../utils/userHelper";
import { createDoctorInforByApi } from "../utils/doctorHelper";
import { randomSchedulesData } from "../tests/testData/schedulesData";
import { randomBookingData } from "../tests/testData/bookingData";
import { convertDatetimeToString, randomValue } from "../utils/commonUtils";
import { Booking, DoctorInfor, Schedule, User } from "../utils/types";

type TestOptions = {
  authToken: string;
  loginByToken: void;
  createAdmin: User;
  createDoctor: User;
  createPatient: User;
  deletePatient: void;
  createDoctorInfor: DoctorInfor;
  createSchedule: Schedule[];
  createBooking: { booking: Booking; patient_user: User };
  verifyBooking: Booking;
  page: Page;
};

const authFile = ".auth/user.json";

export const test = base.extend<TestOptions>({
  authToken: async ({}, use) => {
    const response = await api.post("/api/login", {
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
    });

    let data = await response.data;
    if (response.status !== 200 || !data.token) {
      throw new Error("Failed to login and get token");
    }
    fs.writeFileSync(authFile, JSON.stringify(data));
    process.env["ACCESS_TOKEN"] = data.token;
    await use("");
  },

  loginByToken: [
    async ({ page, authToken }, use) => {
      const token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
      await page.goto("/login");
      await page.evaluate((token) => {
        localStorage.setItem("token", token);
      }, token);
      await page.reload();

      await use();
    },
    { auto: true },
  ],

  createAdmin: async ({}, use) => {
    const admin = await createUserByApi(process.env.ACCESS_TOKEN!, "Admin");
    use(admin);
  },

  createDoctor: async ({}, use) => {
    const doctor = await createUserByApi(process.env.ACCESS_TOKEN!, "Doctor");
    use(doctor);
  },

  createPatient: async ({}, use) => {
    const patient = await createUserByApi(process.env.ACCESS_TOKEN!, "Patient");
    use(patient);
  },

  createDoctorInfor: async ({ createDoctor }, use) => {
    const doctor = createDoctor;
    const doctorInfor = await createDoctorInforByApi(
      process.env.ACCESS_TOKEN!,
      doctor.id
    );

    use(doctorInfor);
  },

  createSchedule: async ({ request, createDoctor }, use) => {
    //setup fixture
    const doctor = createDoctor;
    const schedules = await randomSchedulesData(doctor.id);
    const response = await request.post(
      `${process.env.SERVER_URL}/api/bulk-create-schedules`,
      {
        headers: { Authorization: process.env.ACCESS_TOKEN! },
        data: schedules,
      }
    );
    let data = await response.json();
    if (response.status() !== 200 || data.errCode !== 0) {
      throw new Error("Failed to create schedules");
    }
    use(data.schedules);
  },

  createBooking: async (
    { request, createDoctorInfor, createSchedule },
    use
  ) => {
    const doctorInfor = createDoctorInfor;
    const schedules = createSchedule;
    const date = convertDatetimeToString(schedules[0].date);
    const timeType = randomValue(schedules).timeType;

    //create randomBookingInfor:
    let bookingData = await randomBookingData(
      doctorInfor.doctorId,
      date,
      timeType
    );
    const response = await request.post(
      `${process.env.SERVER_URL}/api/patient-book-appointment`,
      { data: bookingData }
    );

    let data = await response.json();
    if (response.status() !== 200 || data.errCode !== 0) {
      throw new Error("Failed to create schedules");
    }
    use({ booking: data.booking, patient_user: data.patient_user });
  },

  verifyBooking: async ({ request, createBooking }, use) => {
    const booking = createBooking.booking;
    const response = await request.put(
      `${process.env.SERVER_URL}/api/verify-book-appointment`,
      { params: { token: booking.token, doctorId: booking.doctorId } }
    );
    let data = await response.json();
    if (response.status() !== 200 || data.errCode !== 0) {
      throw new Error("Failed to verify booking");
    }
    use(data.data);
  },

  page: async ({ page }, use) => {
    await use(page);
  },
});
export { expect } from "@playwright/test";
