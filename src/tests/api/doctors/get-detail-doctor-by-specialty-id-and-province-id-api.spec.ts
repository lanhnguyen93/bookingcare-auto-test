import { test, expect } from "../../../fixtures/base-test";
import {
  createDoctorInforByApi,
  deleteDoctorInforByApi,
} from "../../../utils/doctorHelper";
import { createUserByApi, deleteUserByApi } from "../../../utils/userHelper";

let token: string;
let doctor: any;
let doctorInfor: any;

//Get all doctor infors from DoctorInfor table
test.beforeAll(async ({ authToken, createDoctorInfor }) => {
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

test("should fail to get without specialty-id", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-detail-doctor-by-specialty-id-and-province-id`,
    {
      params: {
        provinceId: doctorInfor.provinceId,
      },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual(
    "Missing required paramter: specialtyId, provinceId"
  );
});

test("should fail to get without province-id", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-detail-doctor-by-specialty-id-and-province-id`,
    {
      params: {
        specialtyId: doctorInfor.specialtyId,
      },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual(
    "Missing required paramter: specialtyId, provinceId"
  );
});

test("should fail to get with invalid params", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-detail-doctor-by-specialty-id-and-province-id`,
    {
      params: {
        specialtyId: `invalid ${doctorInfor.specialtyId}`,
        provinceId: `invalid ${doctorInfor.provinceId}`,
      },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("Doctor infor not found");
});

test("should get detail doctor by specialty-id and province-id successfully", async ({
  request,
}) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-detail-doctor-by-specialty-id-and-province-id`,
    {
      params: {
        specialtyId: doctorInfor.specialtyId,
        provinceId: doctorInfor.provinceId,
      },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.doctorInfors.length).toBeGreaterThanOrEqual(1);
  expect(data.doctorInfors[0].specialtyId).toBe(doctorInfor.specialtyId);
  expect(data.doctorInfors[0].provinceId).toBe(doctorInfor.provinceId);
  expect(data.doctorInfors[0]).toHaveProperty("priceData");
  expect(data.doctorInfors[0]).toHaveProperty("paymentData");
  expect(data.doctorInfors[0]).toHaveProperty("clinicData");
  expect(data.doctorInfors[0]).toHaveProperty("specialtyData");
});
