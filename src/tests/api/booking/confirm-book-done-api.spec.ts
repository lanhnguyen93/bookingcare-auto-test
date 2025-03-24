import path from "path";
import { test, expect } from "../../../fixtures/base-test";
import { getBase64 } from "../../../utils/commonUtils";
import { Booking, User } from "../../../utils/types";
import { ConfirmBookingDataType } from "../../testData/bookingData";
import { deleteBookingByApi } from "../../../utils/bookingHelper";
import {
  deleteDoctorInforByApi,
  deleteScheduleByApi,
} from "../../../utils/doctorHelper";
import { deleteUserByApi } from "../../../utils/userHelper";

let token: string;
let booking: Booking;
let confirmBookingData: ConfirmBookingDataType;
let patient: User;
const imagePath = path.resolve(
  __dirname,
  "../../../tests/testData/image-test.png"
);

test.beforeAll(async ({ authToken, createBooking }) => {
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";

  //verify booking
  const bookingInfor = createBooking;
  booking = createBooking.booking;
  patient = createBooking.patient_user;
  console.log("check booking: ", booking);

  //prepare confirmData
  confirmBookingData = {
    id: booking.id,
    email: patient.email,
    file: getBase64(imagePath),
    fullname: patient.firstName,
    lang: "vi", //fake because get from localstorage
  };
});

test.afterAll(async () => {
  await deleteBookingByApi(token, booking.id);
  await deleteScheduleByApi(token, booking.doctorId!, booking.date!);
  await deleteDoctorInforByApi(token, booking.doctorId!);
  await deleteUserByApi(token, booking.doctorId!);
  await deleteUserByApi(token, booking.patientId!);
});

test("should fail to verify without id", async ({ request }) => {
  let reConfirmBookingData = JSON.parse(JSON.stringify(confirmBookingData));
  reConfirmBookingData.id = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/confirm-book-done`,
    {
      headers: { Authorization: token },
      data: reConfirmBookingData,
    }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing require parameter: id, email, file");
});

test("should fail to verify without email", async ({ request }) => {
  let reConfirmBookingData = JSON.parse(JSON.stringify(confirmBookingData));
  reConfirmBookingData.email = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/confirm-book-done`,
    {
      headers: { Authorization: token },
      data: reConfirmBookingData,
    }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing require parameter: id, email, file");
});

test("should fail to verify without file", async ({ request }) => {
  let reConfirmBookingData = JSON.parse(JSON.stringify(confirmBookingData));
  reConfirmBookingData.file = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/confirm-book-done`,
    {
      headers: { Authorization: token },
      data: reConfirmBookingData,
    }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing require parameter: id, email, file");
});

test("should fail to verify with invalid id", async ({ request }) => {
  let reConfirmBookingData = JSON.parse(JSON.stringify(confirmBookingData));
  reConfirmBookingData.id = "invalid_id";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/confirm-book-done`,
    {
      headers: { Authorization: token },
      data: reConfirmBookingData,
    }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("Booking not found!");
});

test("should fail to confirm booking without authorization", async ({
  request,
}) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/confirm-book-done`,
    { data: confirmBookingData }
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
      data: confirmBookingData,
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
      data: confirmBookingData,
    }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(0);
  expect(data.message).toEqual("Confirm book done successfully");
});
