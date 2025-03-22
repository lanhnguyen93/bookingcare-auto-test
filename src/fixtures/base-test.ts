import { test as base } from "@playwright/test";
import { Page } from "../pages/basePage";
import fs from "fs";
import {
  createRandomBookingInfor,
  createRandomDoctorInfor,
  createRandomSchedule,
  createUser,
} from "../utils/helper";

type TestOptions = {
  authToken: string;
  createAdmin: any;
  createDoctor: any;
  createPatient: any;
  deletePatient: void;
  createDoctorInfor: any;
  createSchedule: any;
  createBooking: any;
  verifyBooking: any;
  page: Page;
};

const authFile = ".auth/user.json";

export const test = base.extend<TestOptions>({
  authToken: [
    async ({ request }, use) => {
      const response = await request.post(
        `${process.env.SERVER_URL}/api/login`,
        {
          data: {
            email: process.env.USER_EMAIL,
            password: process.env.USER_PASSWORD,
          },
        }
      );
      let data = await response.json();
      if (response.status() !== 200 || !data.token) {
        throw new Error("Failed to login and get token");
      }
      fs.writeFileSync(authFile, JSON.stringify(data));
      process.env["ACCESS_TOKEN"] = data.token;
      await use("");
    },
    { auto: true },
  ],

  createAdmin: async ({}, use) => {
    const admin = await createUser(process.env.ACCESS_TOKEN!, "admin");
    use(admin);
  },

  createDoctor: async ({}, use) => {
    const doctor = await createUser(process.env.ACCESS_TOKEN!, "doctor");
    use(doctor);
  },

  createPatient: async ({}, use) => {
    const patient = await createUser(process.env.ACCESS_TOKEN!, "patient");
    use(patient);
  },

  createDoctorInfor: async ({ request, createDoctor }, use) => {
    const doctor = createDoctor;
    const doctorInfor = await createRandomDoctorInfor();
    doctorInfor.doctorId = doctor.id;
    const response = await request.post(
      `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
      {
        headers: { Authorization: process.env.ACCESS_TOKEN! },
        data: doctorInfor,
      }
    );

    let data = await response.json();
    if (response.status() !== 201 || data.errCode !== 0) {
      throw new Error("Failed to create doctor infor");
    }
    use(data.doctor);
  },

  createSchedule: async ({ request, createDoctor }, use) => {
    //setup fixture
    const doctor = createDoctor;
    const schedules = await createRandomSchedule(doctor.id);
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

    //create randomBookingInfor:
    let bookingInfor = await createRandomBookingInfor();
    bookingInfor.doctorId = doctorInfor.doctorId;
    bookingInfor.date = new Date(schedules[0].date).toISOString().split("T")[0];
    bookingInfor.timeType =
      schedules[Math.floor(Math.random() * schedules.length)].timeType;
    //Fake data because these datas're handled in front end
    bookingInfor.time = "fake data - time";
    bookingInfor.price = "fake data - price";
    bookingInfor.doctorName = "fake data - doctorName";

    const response = await request.post(
      `${process.env.SERVER_URL}/api/patient-book-appointment`,
      { data: bookingInfor }
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
