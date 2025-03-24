import { test, expect } from "../../../../fixtures/base-test";
import {
  createDoctorInforByApi,
  deleteDoctorInforByApi,
} from "../../../../utils/doctorHelper";
import { DoctorInfor, User } from "../../../../utils/types";
import { createUserByApi, deleteUserByApi } from "../../../../utils/userHelper";
import {
  DoctorInforDataType,
  randomDoctorInforData,
} from "../../../testData/doctorInforData";

let token: string;
let doctorId: string;
let doctor: User;
let doctorInfor: DoctorInfor;
let doctorInforData: DoctorInforDataType;

test.beforeAll(async ({ authToken }) => {
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";

  //create a doctorInfor
  doctor = await createUserByApi(token, "Doctor");
  doctorId = doctor.id;
  doctorInfor = await createDoctorInforByApi(token, doctorId);
  console.log(
    `check create user: email = ${doctor.email}, userId-doctorId - ${doctor.id}`
  );

  //create doctorInforData to update for this user
  doctorInforData = await randomDoctorInforData(doctorId);
});

test.afterAll(async ({ request }) => {
  await deleteUserByApi(token, doctorId);
  await deleteDoctorInforByApi(token, doctorId);
});

test("should fail to create without doctorId", async ({ request }) => {
  let reDoctorInforData = JSON.parse(JSON.stringify(doctorInforData));
  reDoctorInforData.doctorId = "";
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: reDoctorInforData,
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual(
    "Missing required paramters: doctorId or description or content"
  );
});

test("should fail to create without description", async ({ request }) => {
  let reDoctorInforData = JSON.parse(JSON.stringify(doctorInforData));
  reDoctorInforData.description = "";
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: reDoctorInforData,
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual(
    "Missing required paramters: doctorId or description or content"
  );
});

test("should fail to create without contentHTML", async ({ request }) => {
  let reDoctorInforData = JSON.parse(JSON.stringify(doctorInforData));
  reDoctorInforData.contentHTML = "";
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: reDoctorInforData,
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual(
    "Missing required paramters: doctorId or description or content"
  );
});

test("should fail to create without contentMarkdown", async ({ request }) => {
  let reDoctorInforData = JSON.parse(JSON.stringify(doctorInforData));
  reDoctorInforData.contentMarkdown = "";
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: reDoctorInforData,
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual(
    "Missing required paramters: doctorId or description or content"
  );
});

test("should fail to create a user without authorization", async ({
  request,
}) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-detail-info-doctor`,
    { data: doctorInforData }
  );

  let data = await response.json();

  expect(response.status()).toEqual(401);
  expect(data.errCode).toEqual(-2);
  expect(data.message).toEqual("Authorization token is required.");
});

test("should fail to create a user with invalid authorization", async ({
  request,
}) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-detail-info-doctor`,
    {
      headers: { Authorization: `Token ${token}` },
      data: doctorInforData,
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(500);
  expect(data.errCode).toEqual(-3);
  expect(data.message).toEqual("Failed to authenticate token.");
});

test("should edit detail infor doctor successfully", async ({ request }) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: doctorInforData,
    }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(0);
  expect(data.doctor.priceId).toBe(doctorInforData.priceId);
  expect(data.doctor.paymentId).toBe(doctorInforData.paymentId);
  expect(data.doctor.provinceId).toBe(doctorInforData.provinceId);
  expect(data.doctor.specialtyId).toBe(doctorInforData.specialtyId);
  expect(data.doctor.contentMarkdown).toBe(doctorInforData.contentMarkdown);
  expect(data.doctor.description).toBe(doctorInforData.description);
  expect(data.doctor.note).toBe(doctorInforData.note);
});
