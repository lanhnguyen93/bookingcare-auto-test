import { test as base } from "@playwright/test";
import { Page } from "../pages/basePage";
import fs from "fs";
import {
  createRandomDoctorInfor,
  createRandomSchedule,
  createUser,
} from "../utils/helper";

type TestOptions = {
  authToken: string;
  createAdmin: any;
  createDoctor: any;
  createPatient: any;
  createDoctorInfor: any;
  createSchedule: any;
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

    //teardown-fixture
    // const deleteResponse = await request.delete(
    //   `${process.env.SERVER_URL}/api/delete-schedules`,
    //   {
    //     headers: { Authorization: process.env.ACCESS_TOKEN! },
    //     data: { doctorId: doctor.id, date: schedules[0].date },
    //   }
    // );
    // let deleteData = await deleteResponse.json();
    // if (response.status() !== 200 || deleteData.errCode !== 0) {
    //   throw new Error("Failed to create schedules");
    // }
  },

  page: async ({ page }, use) => {
    await use(page);
  },
});
export { expect } from "@playwright/test";
