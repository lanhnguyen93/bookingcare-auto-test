import { test, expect } from "../../../../fixtures/base-test";
import {
  createDoctorInforByApi,
  deleteDoctorInforByApi,
} from "../../../../utils/doctorHelper";
import { DoctorInfor } from "../../../../utils/types";
import { createUserByApi, deleteUserByApi } from "../../../../utils/userHelper";
import {
  DoctorInforDataType,
  randomDoctorInforData,
} from "../../../testData/doctorInforData";

let token: string;
let doctorId: string;
let doctor: any;
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
});

test.afterAll(async () => {
  await deleteUserByApi(token, doctorId);
});

test("should fail to delete without id", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-detail-info-doctor`,
    { headers: { Authorization: token } }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing required parameter!");
});

test("should fail to delete with invalid id", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-detail-info-doctor`,
    {
      headers: { Authorization: token },
      params: { doctorId: "invalid doctorId" },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("The doctorInfor is not exist!");
});

test("should fail to delete without authorization", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-detail-info-doctor`,
    { params: { doctorId: doctorId } }
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
    `${process.env.SERVER_URL}/api/delete-detail-info-doctor`,
    {
      headers: { Authorization: `Token ${token}` },
      params: { doctorId: doctorId },
    }
  );
  let data = await response.json();

  expect(response.status()).toEqual(500);
  expect(data.errCode).toEqual(-3);
  expect(data.message).toEqual("Failed to authenticate token.");
});

test("should delete doctor infor successfully", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-detail-info-doctor`,
    {
      headers: { Authorization: token },
      params: { doctorId: doctorId },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(0);
  expect(data).toHaveProperty("doctorInfor");
});
