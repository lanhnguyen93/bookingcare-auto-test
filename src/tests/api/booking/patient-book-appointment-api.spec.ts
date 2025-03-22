import { da } from "@faker-js/faker";
import { test, expect } from "../../../fixtures/base-test";
import {
  createRandomBookingInfor,
  deleteBooking,
  deleteDoctorInfor,
  deleteSchedule,
  deleteUser,
} from "../../../utils/helper";
import * as Types from "../../../utils/typesBase";

let token: string;
let doctorInfor: any;
let schedules: any;
let bookingInfor: Types.Booking;

test.beforeAll(async ({ authToken, createDoctorInfor, createSchedule }) => {
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  doctorInfor = createDoctorInfor;
  schedules = createSchedule;

  //create randomBookingInfor:
  bookingInfor = await createRandomBookingInfor();
  bookingInfor.doctorId = doctorInfor.doctorId;
  bookingInfor.date = new Date(schedules[0].date).toISOString().split("T")[0];
  bookingInfor.timeType =
    schedules[Math.floor(Math.random() * schedules.length)].timeType;
  //Fake data because these datas're handled in front end
  bookingInfor.time = "fake data - time";
  bookingInfor.price = "fake data - price";
  bookingInfor.doctorName = "fake data - doctorName";
  console.log("check booking Infor: ", bookingInfor);
});

test.afterAll(async ({ request }) => {
  //Teardown - delete schedule
  await deleteSchedule(token, bookingInfor.doctorId!, bookingInfor.date!);

  //Teardown - delete doctorInfor
  await deleteDoctorInfor(token, bookingInfor.doctorId!);

  //Teardown - delete doctor
  await deleteUser(token, bookingInfor.doctorId!);
});

test("should fail to create without email", async ({ request }) => {
  let re_bookInfor = JSON.parse(JSON.stringify(bookingInfor));
  re_bookInfor.email = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/patient-book-appointment`,
    { data: re_bookInfor }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual(
    "Missing require parameter: patitent-id, doctorId, date, timeType"
  );
});

test("should fail to create without doctorId", async ({ request }) => {
  let re_bookInfor = JSON.parse(JSON.stringify(bookingInfor));
  re_bookInfor.doctorId = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/patient-book-appointment`,
    { data: re_bookInfor }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual(
    "Missing require parameter: patitent-id, doctorId, date, timeType"
  );
});

test("should fail to create without date", async ({ request }) => {
  let re_bookInfor = JSON.parse(JSON.stringify(bookingInfor));
  re_bookInfor.date = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/patient-book-appointment`,
    { data: re_bookInfor }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual(
    "Missing require parameter: patitent-id, doctorId, date, timeType"
  );
});

test("should fail to create without timeType", async ({ request }) => {
  let re_bookInfor = JSON.parse(JSON.stringify(bookingInfor));
  re_bookInfor.timeType = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/patient-book-appointment`,
    { data: re_bookInfor }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual(
    "Missing require parameter: patitent-id, doctorId, date, timeType"
  );
});

test("should create a new booking with a new patient successfully ", async ({
  request,
}) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/patient-book-appointment`,
    { data: bookingInfor }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(0);
  expect(data.message).toEqual(
    "Created a new patient user && Created a new book"
  );
  expect(data).toHaveProperty("booking");
  expect(data.booking).toHaveProperty("token");
  expect(data).toHaveProperty("patient_user");
  expect(data.booking.doctorId).toBe(bookingInfor.doctorId);
  expect(data.booking.date).toBe(bookingInfor.date);
  expect(data.booking.timeType).toBe(bookingInfor.timeType);
  expect(data.patient_user.email).toBe(bookingInfor.email);
  expect(data.patient_user.firstName).toBe(bookingInfor.firstName);

  //Teardown - delete patient
  await deleteUser(token, data.patient_user.id);

  //Teardown - delete booking
  await deleteBooking(token, data.booking.id);
});

test("should create when exist patient and exist booking", async ({
  request,
  createPatient,
}) => {
  //Create a patient before booking
  const patient = createPatient;
  bookingInfor.email = patient.email;
  const response_1 = await request.post(
    `${process.env.SERVER_URL}/api/patient-book-appointment`,
    { data: bookingInfor }
  );
  let data_1 = await response_1.json();
  expect(response_1.status()).toEqual(200);
  expect(data_1.errCode).toEqual(0);
  expect(data_1.message).toEqual(
    "Paitent's already exist && Created a new book"
  );

  //Re-create booking
  const response_2 = await request.post(
    `${process.env.SERVER_URL}/api/patient-book-appointment`,
    { data: bookingInfor }
  );
  let data_2 = await response_2.json();
  expect(response_2.status()).toEqual(200);
  expect(data_2.errCode).toEqual(0);
  expect(data_2.message).toEqual(
    "Paitent's already exist && The book is exist"
  );

  //Teardown - delete patient
  await deleteUser(token, patient.id);

  //Teardown - delete booking
  await deleteBooking(token, data_2.booking.id);
});

//Check email
// Không check được trong api vì xử lý bởi thư viện
