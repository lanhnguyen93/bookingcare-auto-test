import { test, expect } from "../../../../fixtures/base-test";
import { deleteScheduleByApi } from "../../../../utils/doctorHelper";
import { createUserByApi, deleteUserByApi } from "../../../../utils/userHelper";
import {
  randomSchedulesData,
  ScheduleDataType,
} from "../../../testData/schedulesData";

let token: string;
let doctorId: string;
let schedulesData: ScheduleDataType[];

test.beforeAll(async ({ authToken }) => {
  //get token, create a new doctor, create random schedule
  //get token
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  let doctor = await createUserByApi(token, "Doctor");
  console.log(
    `check create user: email = ${doctor.email}, userId-doctorId - ${doctor.id}`
  );
  doctorId = doctor.id;

  //create random schedule
  schedulesData = await randomSchedulesData(doctorId);
  console.log("check schedules infor: ", schedulesData);
});

test.afterAll(async () => {
  await deleteUserByApi(token, doctorId);
});

test("should fail to create without schedule data", async ({ request }) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/bulk-create-schedules`,
    { headers: { Authorization: token } }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("No data or data is not an array");
});

test("should fail to create without authorization", async ({ request }) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/bulk-create-schedules`,
    { data: schedulesData }
  );

  let data = await response.json();

  expect(response.status()).toEqual(401);
  expect(data.errCode).toEqual(-2);
  expect(data.message).toEqual("Authorization token is required.");
});

test("should fail to create with invalid authorization", async ({
  request,
}) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/bulk-create-schedules`,
    { headers: { Authorization: `Token ${token}` }, data: schedulesData }
  );

  let data = await response.json();

  expect(response.status()).toEqual(500);
  expect(data.errCode).toEqual(-3);
  expect(data.message).toEqual("Failed to authenticate token.");
});

test("should bulk create schedules successfully", async ({ request }) => {
  //Create a new schedule
  const response_1 = await request.post(
    `${process.env.SERVER_URL}/api/bulk-create-schedules`,
    {
      headers: { Authorization: token },
      data: schedulesData,
    }
  );

  let data_1 = await response_1.json();
  expect(response_1.status()).toEqual(200);
  expect(data_1.errCode).toEqual(0);
  expect(data_1.message).toEqual("Add new schedules successfully");

  //Delete exist schedule and re-create schedule
  const date = schedulesData[0].date;
  const reSchedulesData = await randomSchedulesData(doctorId, date);
  const response_2 = await request.post(
    `${process.env.SERVER_URL}/api/bulk-create-schedules`,
    {
      headers: { Authorization: token },
      data: reSchedulesData,
    }
  );

  let data_2 = await response_2.json();
  expect(response_2.status()).toEqual(200);
  expect(data_2.errCode).toEqual(0);
  expect(data_2.message).toEqual(
    "Delete old schedules and add new schedules successfully"
  );

  // Teardown - delete schedule after creating
  await deleteScheduleByApi(token, doctorId, date);
});
