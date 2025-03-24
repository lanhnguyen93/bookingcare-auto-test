import { test, expect } from "../../../fixtures/base-test";
import { deleteBookingByApi } from "../../../utils/bookingHelper";
import {
  deleteDoctorInforByApi,
  deleteScheduleByApi,
} from "../../../utils/doctorHelper";
import { Booking } from "../../../utils/types";
import { deleteUserByApi } from "../../../utils/userHelper";

let token: string;
let booking: Booking;

test.beforeAll(async ({ authToken, createBooking }) => {
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  booking = createBooking.booking;
  console.log("check booking: ", booking);
});

test.afterAll(async () => {
  await deleteScheduleByApi(token, booking.doctorId!, booking.date!);
  await deleteDoctorInforByApi(token, booking.doctorId!);
  await deleteUserByApi(token, booking.doctorId!);
  await deleteUserByApi(token, booking.patientId!);
  await deleteBookingByApi(token, booking.id);
});

test("should fail to verify without token", async ({ request }) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/verify-book-appointment`,
    { params: { doctorId: booking.doctorId } }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing require parameter: token, doctorId");
});

test("should fail to verify without doctorId", async ({ request }) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/verify-book-appointment`,
    { params: { token: booking.token } }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing require parameter: token, doctorId");
});

test("should fail to verify with invalid token", async ({ request }) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/verify-book-appointment`,
    {
      params: {
        token: `Token ${booking.token}`,
        doctorId: booking.doctorId,
      },
    }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("Booking not found!");
});

test("should fail to verify with invalid doctorId", async ({ request }) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/verify-book-appointment`,
    {
      params: {
        token: booking.token,
        doctorId: `Invalid_id ${booking.doctorId}`,
      },
    }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("Booking not found!");
});

test("should verify booking successfully ", async ({ request }) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/verify-book-appointment`,
    { params: { token: booking.token, doctorId: booking.doctorId } }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(0);
  expect(data.message).toEqual("Verify successfully");
  expect(data).toHaveProperty("data");
});
