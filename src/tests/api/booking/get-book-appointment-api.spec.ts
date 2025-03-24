import { test, expect } from "../../../fixtures/base-test";
import { deleteBookingByApi } from "../../../utils/bookingHelper";
import {
  deleteDoctorInforByApi,
  deleteScheduleByApi,
} from "../../../utils/doctorHelper";
import { deleteUserByApi } from "../../../utils/userHelper";

let token: string;
let booking: any;

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

test("should fail to delete without id", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-book-appointment-by-doctor-id`,
    {
      headers: { Authorization: token },
      params: { date: booking.date },
    }
  );
  let data = await response.json();

  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing required parameter: doctorId or date");
});

test("should fail to get without date", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-book-appointment-by-doctor-id`,
    {
      headers: { Authorization: token },
      params: { doctorId: booking.doctorId },
    }
  );
  let data = await response.json();

  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing required parameter: doctorId or date");
});

test("should fail to get booking without authorization", async ({
  request,
}) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-book-appointment-by-doctor-id`,
    {
      params: { doctorId: booking.doctorId, date: booking.date },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(401);
  expect(data.errCode).toEqual(-2);
  expect(data.message).toEqual("Authorization token is required.");
});

test("should fail to get booking with invalid authorization", async ({
  request,
}) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-book-appointment-by-doctor-id`,
    {
      headers: { Authorization: `Token ${token}` },
      params: { doctorId: booking.doctorId, date: booking.date },
    }
  );
  let data = await response.json();

  expect(response.status()).toEqual(500);
  expect(data.errCode).toEqual(-3);
  expect(data.message).toEqual("Failed to authenticate token.");
});

test("should get booking per day by id successfully", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-book-appointment-by-doctor-id`,
    {
      headers: { Authorization: token },
      params: { doctorId: booking.doctorId, date: booking.date },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(0);
  expect(data).toHaveProperty("books");
});
