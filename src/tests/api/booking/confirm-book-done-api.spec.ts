import { test, expect } from "../../../fixtures/base-test";
import {
  deleteBooking,
  deleteDoctorInfor,
  deleteSchedule,
  deleteUser,
} from "../../../utils/helper";

let token: string;
let booking: any;
let confirmData: any;

test.beforeAll(async ({ authToken, verifyBooking }) => {
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";

  //verify booking
  booking = verifyBooking;
  console.log("check booking: ", booking);

  //prepare confirmData
  confirmData = {
    id: booking.id,
    email: "testviewpoint93@gmail.com", //handle client side
    file: "test file", //handle base64
    fullname: "Test Viewpoint", //handle client side
    lang: "vi", //fake because get from localstorage
  };
});

test.afterAll(async () => {
  await deleteBooking(token, booking.id);
  await deleteSchedule(token, booking.doctorId!, booking.date!);
  await deleteDoctorInfor(token, booking.doctorId!);
  await deleteUser(token, booking.doctorId!);
  await deleteUser(token, booking.patientId!);
});

test("should fail to verify without id", async ({ request }) => {
  let re_confirmData = JSON.parse(JSON.stringify(confirmData));
  re_confirmData.id = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/confirm-book-done`,
    {
      headers: { Authorization: token },
      data: re_confirmData,
    }
  );

  let data = await response.json();
  console.log("check data: ", data);
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing require parameter: id, email, file");
});

test("should fail to verify without email", async ({ request }) => {
  let re_confirmData = JSON.parse(JSON.stringify(confirmData));
  re_confirmData.email = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/confirm-book-done`,
    {
      headers: { Authorization: token },
      data: re_confirmData,
    }
  );

  let data = await response.json();
  console.log("check data: ", data);
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing require parameter: id, email, file");
});

test("should fail to verify without file", async ({ request }) => {
  let re_confirmData = JSON.parse(JSON.stringify(confirmData));
  re_confirmData.file = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/confirm-book-done`,
    {
      headers: { Authorization: token },
      data: re_confirmData,
    }
  );

  let data = await response.json();
  console.log("check data: ", data);
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing require parameter: id, email, file");
});

test("should fail to verify with invalid id", async ({ request }) => {
  let re_confirmData = JSON.parse(JSON.stringify(confirmData));
  re_confirmData.id = "invalid_id";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/confirm-book-done`,
    {
      headers: { Authorization: token },
      data: re_confirmData,
    }
  );

  let data = await response.json();
  console.log("check data: ", data);
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("Booking not found!");
});

test("should fail to confirm booking without authorization", async ({
  request,
}) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/confirm-book-done`,
    confirmData
  );

  let data = await response.json();

  expect(response.status()).toEqual(401);
  expect(data.errCode).toEqual(-2);
  expect(data.message).toEqual("Authorization token is required.");
});

test("should fail to confirm booking with invalid authorization", async ({
  request,
}) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/confirm-book-done`,
    {
      headers: { Authorization: `Token ${token}` },
      data: confirmData,
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(500);
  expect(data.errCode).toEqual(-3);
  expect(data.message).toEqual("Failed to authenticate token.");
});

test("should confirm booking done successfully ", async ({ request }) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/confirm-book-done`,
    {
      headers: { Authorization: token },
      data: confirmData,
    }
  );

  let data = await response.json();
  console.log("check data: ", data);
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(0);
  expect(data.message).toEqual("Confirm book done successfully");
});
