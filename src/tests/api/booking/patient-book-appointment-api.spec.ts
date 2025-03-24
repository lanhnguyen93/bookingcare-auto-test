import { test, expect } from "../../../fixtures/base-test";
import { deleteBookingByApi } from "../../../utils/bookingHelper";
import {
  convertDatetimeToString,
  randomValue,
} from "../../../utils/commonUtils";
import {
  createDoctorInforByApi,
  createSchedulesByApi,
  deleteDoctorInforByApi,
  deleteScheduleByApi,
} from "../../../utils/doctorHelper";
import { DoctorInfor, Schedule, User } from "../../../utils/types";
import { createUserByApi, deleteUserByApi } from "../../../utils/userHelper";
import { BookingDataType, randomBookingData } from "../../testData/bookingData";

let token: string;
let doctorId: string;
let doctor: User;
let doctorInfor: DoctorInfor;
let schedules: Schedule[];
let date: string;
let bookingData: BookingDataType;

test.beforeAll(async ({ authToken }) => {
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  doctor = await createUserByApi(token, "Doctor");
  doctorId = doctor.id;
  doctorInfor = await createDoctorInforByApi(token, doctorId);
  schedules = await createSchedulesByApi(token, doctorId);
  date = convertDatetimeToString(schedules[0].date);
  console.log("check date: ", date);

  //create randomBookingInfor:
  bookingData = await randomBookingData(
    doctorId,
    date,
    randomValue(schedules).timeType
  );
  console.log("check booking data: ", bookingData);
});

test.afterAll(async ({ request }) => {
  await deleteScheduleByApi(token, doctorId!, date!);
  await deleteDoctorInforByApi(token, doctorId!);
  await deleteUserByApi(token, doctorId!);
});

test("should fail to create without email", async ({ request }) => {
  let reBookingData = JSON.parse(JSON.stringify(bookingData));
  reBookingData.email = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/patient-book-appointment`,
    { data: reBookingData }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual(
    "Missing require parameter: patitent-email, doctorId, date, timeType"
  );
});

test("should fail to create without doctorId", async ({ request }) => {
  let reBookingData = JSON.parse(JSON.stringify(bookingData));
  reBookingData.doctorId = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/patient-book-appointment`,
    { data: reBookingData }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual(
    "Missing require parameter: patitent-email, doctorId, date, timeType"
  );
});

test("should fail to create without date", async ({ request }) => {
  let reBookingData = JSON.parse(JSON.stringify(bookingData));
  reBookingData.date = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/patient-book-appointment`,
    { data: reBookingData }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual(
    "Missing require parameter: patitent-email, doctorId, date, timeType"
  );
});

test("should fail to create without timeType", async ({ request }) => {
  let reBookingData = JSON.parse(JSON.stringify(bookingData));
  reBookingData.timeType = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/patient-book-appointment`,
    { data: reBookingData }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual(
    "Missing require parameter: patitent-email, doctorId, date, timeType"
  );
});

test("should create a new booking with a new patient successfully ", async ({
  request,
}) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/patient-book-appointment`,
    { data: bookingData }
  );

  let data = await response.json();
  console.log("check data: ", data);
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(0);
  expect(data.message).toEqual(
    "Created a new patient user && Created a new book"
  );
  expect(data).toHaveProperty("booking");
  expect(data.booking).toHaveProperty("token");
  expect(data).toHaveProperty("patient_user");
  expect(data.booking.doctorId).toBe(bookingData.doctorId);
  expect(data.booking.date).toBe(bookingData.date);
  expect(data.booking.timeType).toBe(bookingData.timeType);
  expect(data.patient_user.email).toBe(bookingData.email);
  expect(data.patient_user.firstName).toBe(bookingData.firstName);

  //Teardown - delete patient, booking
  await deleteUserByApi(token, data.patient_user.id);
  await deleteBookingByApi(token, data.booking.id);
});

test("should create when exist patient and exist booking", async ({
  request,
}) => {
  //Create a patient before booking
  const patient = await createUserByApi(token, "Patient");
  bookingData.email = patient.email;
  const response_1 = await request.post(
    `${process.env.SERVER_URL}/api/patient-book-appointment`,
    { data: bookingData }
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
    { data: bookingData }
  );
  let data_2 = await response_2.json();
  expect(response_2.status()).toEqual(200);
  expect(data_2.errCode).toEqual(0);
  expect(data_2.message).toEqual(
    "Paitent's already exist && The book is exist"
  );

  //Teardown - delete patient, booking
  await deleteUserByApi(token, patient.id);
  await deleteBookingByApi(token, data_2.booking.id);
});

//Check email
// Không check được trong api vì xử lý bởi thư viện
