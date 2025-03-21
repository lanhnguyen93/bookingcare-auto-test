import { test, expect } from "../../../fixtures/base-test-api";
import { createRandomSchedule, createUser } from "../../../utils/helper";

let token: string;
let doctorId: string;
let schedulesInfor: any;

test.beforeAll(async ({ authToken }) => {
  //get token, create a new doctor, create random schedule
  //get token
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  let user = await createUser(token, "Doctor");
  console.log(
    `check create user: email = ${user.email}, userId-doctorId - ${user.id}`
  );
  doctorId = user.id;

  //create random schedule
  schedulesInfor = await createRandomSchedule(doctorId);
  console.log("check schedules infor: ", schedulesInfor);
});

test.afterAll(async ({ request }) => {
  //Teardown - delete user after creating
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-user`,
    {
      headers: { Authorization: token },
      params: { id: doctorId },
    }
  );
  const data = await response.json();
  if (response.status() !== 200 || data.errCode !== 0) {
    throw new Error("Fail to delete user");
  }
});

test("should fail to create without invalid schedule infor", async ({
  request,
}) => {
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
    schedulesInfor
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
    { headers: { Authorization: `Token ${token}` }, data: schedulesInfor }
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
      data: schedulesInfor,
    }
  );

  let data_1 = await response_1.json();
  expect(response_1.status()).toEqual(200);
  expect(data_1.errCode).toEqual(0);
  expect(data_1.message).toEqual("Add new schedules successfully");

  //Delete exist schedule and re-create schedule
  const date = schedulesInfor[0].date;
  const re_schedules = await createRandomSchedule(doctorId, date);
  const response_2 = await request.post(
    `${process.env.SERVER_URL}/api/bulk-create-schedules`,
    {
      headers: { Authorization: token },
      data: re_schedules,
    }
  );

  let data_2 = await response_2.json();
  expect(response_2.status()).toEqual(200);
  expect(data_2.errCode).toEqual(0);
  expect(data_2.message).toEqual(
    "Delete old schedules and add new schedules successfully"
  );

  // Teardown - delete schedule after creating
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-schedules`,
    {
      headers: { Authorization: token },
      data: {
        doctorId: doctorId,
        date: new Date(date),
      },
    }
  );
  let data = await response.json();
  if (response.status() !== 200 || data.errCode !== 0) {
    throw new Error("Fail to delete schedules");
  }
});
