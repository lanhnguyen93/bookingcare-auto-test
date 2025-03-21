import { da } from "@faker-js/faker";
import { test, expect } from "../../../fixtures/base-text-api";
import { createRandomSchedule, createUser } from "../../../utils/helper";

let token: string;
let doctorId: string;
let date: string;
let schedules: any;

test.beforeAll(async ({ authToken, request }) => {
  //get token, create a new doctor, create schedules
  //get token
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  let user = await createUser(token, "Doctor");
  doctorId = user.id;

  //create schedules for this doctor
  const schedulesInfor = await createRandomSchedule(doctorId);
  date = schedulesInfor[0].date;
  const response = await request.post(
    `${process.env.SERVER_URL}/api/bulk-create-schedules`,
    {
      headers: { Authorization: token },
      data: schedulesInfor,
    }
  );

  let data = await response.json();
  if (response.status() !== 200 || data.errCode !== 0) {
    throw new Error("Fail to create schedules");
  }
  schedules = data.schedules;
  console.log(`check init data: doctorId = ${doctorId}, date = ${date}`);
});

test.afterAll(async ({ request }) => {
  //Teardown - delete user after creating
  const response_1 = await request.delete(
    `${process.env.SERVER_URL}/api/delete-user`,
    {
      headers: { Authorization: token },
      params: { id: doctorId },
    }
  );
  const data_1 = await response_1.json();
  if (response_1.status() !== 200 || data_1.errCode !== 0) {
    throw new Error("Fail to delete user");
  }

  //Teardown - schedules user after creating
  const response_2 = await request.delete(
    `${process.env.SERVER_URL}/api/delete-schedules`,
    {
      headers: { Authorization: token },
      data: { doctorId: doctorId, date: date },
    }
  );
  let data_2 = await response_2.json();
  if (response_2.status() !== 200 || data_2.errCode !== 0) {
    throw new Error("Fail to delete schedules");
  }
});

test("should fail to get without doctorId", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-doctor-schedules`,
    {
      headers: { Authorization: token },
      params: { date: date },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing required parameters: doctorId or date");
});

test("should fail to get without date", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-doctor-schedules`,
    {
      headers: { Authorization: token },
      params: { doctorId: doctorId },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing required parameters: doctorId or date");
});

test("should get schedules successfully", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-doctor-schedules`,
    {
      headers: { Authorization: token },
      params: { doctorId: doctorId, date: date },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(0);
  expect(data).toHaveProperty("data");
  expect(data.data[0].doctorId).toEqual(doctorId);
  expect(data.data[0].date).toEqual(schedules[0].date);
});
