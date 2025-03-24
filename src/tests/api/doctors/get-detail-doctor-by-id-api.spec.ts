import { test, expect } from "../../../fixtures/base-test";
import {
  createDoctorInforByApi,
  deleteDoctorInforByApi,
} from "../../../utils/doctorHelper";
import { DoctorInfor, User } from "../../../utils/types";
import { createUserByApi, deleteUserByApi } from "../../../utils/userHelper";

let token: string;
let doctor: User;
let doctorInfor: DoctorInfor;

//Get all doctor infors from DoctorInfor table
test.beforeAll(async ({ authToken }) => {
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";

  //create doctorInfor to ensure has 1 record at least
  doctor = await createUserByApi(token, "Doctor");
  doctorInfor = await createDoctorInforByApi(token, doctor.id);
  console.log("check doctorInfor: ", doctorInfor);
});

test.afterAll(async () => {
  await deleteDoctorInforByApi(token, doctorInfor.doctorId!);
  await deleteUserByApi(token, doctorInfor.doctorId!);
});

test("should fail to get without id", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-detail-doctor-by-id`
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing required paramter!");
});

test("should fail to get with invalid id", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-detail-doctor-by-id`,
    { params: { id: `invalid_id ${doctorInfor.doctorId}` } }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("Doctor not found");
});

test("should get detail doctor by id successfully", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-detail-doctor-by-id`,
    { params: { id: doctorInfor.doctorId } }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.user.id).toBe(doctorInfor.doctorId);
  expect(data.user).toHaveProperty("positionData");
  expect(data.user).toHaveProperty("genderData");
  expect(data.user).toHaveProperty("positionData");
  expect(data.user).toHaveProperty("detailData");
  expect(data.user).not.toHaveProperty("password");
});
