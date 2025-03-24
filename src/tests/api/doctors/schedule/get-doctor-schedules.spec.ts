import { test, expect } from "../../../../fixtures/base-test";
import {
  createSchedulesByApi,
  deleteScheduleByApi,
} from "../../../../utils/doctorHelper";
import { createUserByApi, deleteUserByApi } from "../../../../utils/userHelper";

let token: string;
let doctorId: string;
let date: string;
let schedules: any;

test.beforeAll(async ({ authToken, request }) => {
  //get token, create a new doctor
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  let user = await createUserByApi(token, "Doctor");
  doctorId = user.id;

  //create schedules for this doctor
  schedules = await createSchedulesByApi(token, doctorId);
  date = schedules[0].date;
  console.log(`check init data: doctorId = ${doctorId}, date = ${date}`);
});

test.afterAll(async () => {
  await deleteUserByApi(token, doctorId);
  await deleteScheduleByApi(token, doctorId, date);
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
