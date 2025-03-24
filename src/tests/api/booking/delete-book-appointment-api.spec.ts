import { test, expect } from "../../../fixtures/base-test";
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
});

test("should fail to delete without id", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-book-appointment`,
    {
      headers: { Authorization: token },
    }
  );
  let data = await response.json();

  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing required parameter");
});

test("should fail to delete with invalid id", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-book-appointment`,
    {
      headers: { Authorization: token },
      params: { id: `invalid_id${booking.id}` },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("The booking is not exist!");
});

test("should fail to delete without authorization", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-book-appointment`,
    {
      params: { id: booking.id },
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
    `${process.env.SERVER_URL}/api/delete-book-appointment`,
    {
      headers: { Authorization: `Token ${token}` },
      params: { id: booking.id },
    }
  );
  let data = await response.json();

  expect(response.status()).toEqual(500);
  expect(data.errCode).toEqual(-3);
  expect(data.message).toEqual("Failed to authenticate token.");
});

test("should delete user successfully", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-book-appointment`,
    {
      headers: { Authorization: token },
      params: { id: booking.id },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(0);
  expect(data).toHaveProperty("book");
});
