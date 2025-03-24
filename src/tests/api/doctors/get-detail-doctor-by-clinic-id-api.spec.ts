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

test("should fail to get without clinicId", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-detail-doctor-by-clinic-id`
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing required paramter: clinicId");
});

test("should fail to get with invalid id", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-detail-doctor-by-clinic-id`,
    { params: { clinicId: `invalid_id ${doctorInfor.clinicId}` } }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("Doctor infor not found");
});

test("should get detail doctor by id successfully", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-detail-doctor-by-clinic-id`,
    { params: { clinicId: doctorInfor.clinicId } }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.doctorInfors.length).toBeGreaterThanOrEqual(1);
  expect(data.doctorInfors[0].clinicId).toBe(doctorInfor.clinicId);
  expect(data.doctorInfors[0]).toHaveProperty("priceData");
  expect(data.doctorInfors[0]).toHaveProperty("paymentData");
  expect(data.doctorInfors[0]).toHaveProperty("clinicData");
  expect(data.doctorInfors[0]).toHaveProperty("specialtyData");
});
