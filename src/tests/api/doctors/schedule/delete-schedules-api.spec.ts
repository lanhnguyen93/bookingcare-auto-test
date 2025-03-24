import { test, expect } from "../../../../fixtures/base-test";
import { createSchedulesByApi } from "../../../../utils/doctorHelper";
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
});

test("should fail to delete without doctorId", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-schedules`,
    {
      headers: { Authorization: token },
      data: { date: date },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing required parameters: doctorId or date");
});

test("should fail to delete without date", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-schedules`,
    {
      headers: { Authorization: token },
      data: { doctorId: doctorId },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing required parameters: doctorId or date");
});

test("should fail to delete without authorization", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-schedules`,
    {
      //   headers: { Authorization: token },
      data: { doctorId: doctorId, date: date },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(401);
  expect(data.errCode).toEqual(-2);
  expect(data.message).toEqual("Authorization token is required.");
});

test("should fail to delete with invalid authorization", async ({
  request,
}) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-schedules`,
    {
      headers: { Authorization: `Token ${token}` },
      data: { doctorId: doctorId, date: date },
    }
  );
  let data = await response.json();

  expect(response.status()).toEqual(500);
  expect(data.errCode).toEqual(-3);
  expect(data.message).toEqual("Failed to authenticate token.");
});

test("should delete schedule successfully", async ({ request }) => {
  //Delete when exist schedule in db
  const response_1 = await request.delete(
    `${process.env.SERVER_URL}/api/delete-schedules`,
    {
      headers: { Authorization: token },
      data: { doctorId: doctorId, date: date },
    }
  );
  let data_1 = await response_1.json();
  expect(response_1.status()).toEqual(200);
  expect(data_1.errCode).toEqual(0);
  expect(data_1.message).toEqual("Schedules deleted successfully");

  //Delete when non-exist schedule in db
  const response_2 = await request.delete(
    `${process.env.SERVER_URL}/api/delete-schedules`,
    {
      headers: { Authorization: token },
      data: { doctorId: doctorId, date: date },
    }
  );
  let data_2 = await response_2.json();
  expect(response_2.status()).toEqual(200);
  expect(data_2.errCode).toEqual(2);
  expect(data_2.message).toEqual("Please choose at least a time block");
});
