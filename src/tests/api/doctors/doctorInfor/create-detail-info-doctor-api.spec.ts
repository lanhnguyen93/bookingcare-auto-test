import { test, expect } from "../../../../fixtures/base-test";
import { deleteDoctorInforByApi } from "../../../../utils/doctorHelper";
import { createUserByApi, deleteUserByApi } from "../../../../utils/userHelper";
import {
  DoctorInforDataType,
  randomDoctorInforData,
} from "../../../testData/doctorInforData";

let token: string;
let doctorId: string;
let doctorInforData: DoctorInforDataType;

test.beforeAll(async ({ authToken }) => {
  //get token, create a new user, doctorInfor
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  let user = await createUserByApi(token, "Doctor");
  console.log(
    `check create user: email = ${user.email}, userId-doctorId - ${user.id}`
  );
  doctorId = user.id;
  doctorInforData = await randomDoctorInforData(doctorId);
});

test.afterAll(async () => {
  await deleteUserByApi(token, doctorId);
});

test("should fail to create without doctorId", async ({ request }) => {
  let reDoctorInforData = JSON.parse(JSON.stringify(doctorInforData));
  reDoctorInforData.doctorId = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: reDoctorInforData,
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(201);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual(
    "Missing required paramters: doctorId or description or content"
  );
});

test("should fail to create without description", async ({ request }) => {
  let reDoctorInforData = JSON.parse(JSON.stringify(doctorInforData));
  reDoctorInforData.description = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: reDoctorInforData,
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(201);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual(
    "Missing required paramters: doctorId or description or content"
  );
});

test("should fail to create without contentHTML", async ({ request }) => {
  let reDoctorInforData = JSON.parse(JSON.stringify(doctorInforData));
  reDoctorInforData.contentHTML = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: reDoctorInforData,
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(201);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual(
    "Missing required paramters: doctorId or description or content"
  );
});

test("should fail to create without contentMarkdown", async ({ request }) => {
  let reDoctorInforData = JSON.parse(JSON.stringify(doctorInforData));
  reDoctorInforData.contentMarkdown = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: reDoctorInforData,
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(201);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual(
    "Missing required paramters: doctorId or description or content"
  );
});

test("should fail to create a user without authorization", async ({
  request,
}) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
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
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
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

test("should create detail infor doctor successfully", async ({ request }) => {
  const response_1 = await request.post(
    `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: doctorInforData,
    }
  );

  let data_1 = await response_1.json();
  expect(response_1.status()).toEqual(201);
  expect(data_1.errCode).toEqual(0);
  expect(data_1).toHaveProperty("doctor");

  //should fail to create with existed doctor
  const response_2 = await request.post(
    `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: doctorInforData,
    }
  );

  let data_2 = await response_2.json();
  expect(response_2.status()).toEqual(201);
  expect(data_2.errCode).toEqual(1);
  expect(data_2.message).toEqual("The doctor already exists!");

  //Teardown - delete doctor infor after creating
  await deleteDoctorInforByApi(token, data_1.doctor.doctorId);
});
