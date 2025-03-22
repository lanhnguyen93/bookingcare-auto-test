import { test, expect } from "../../../fixtures/base-test";
import { deleteDoctorInfor, deleteUser } from "../../../utils/helper";

let token: string;
let doctorInfor: any;

//Get all doctor infors from DoctorInfor table
test.beforeAll(async ({ authToken, createDoctorInfor }) => {
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";

  //create doctorInfor to ensure has 1 record at least
  doctorInfor = createDoctorInfor;
  console.log("check doctorInfor: ", doctorInfor);
});

test.afterAll(async () => {
  await deleteDoctorInfor(token, doctorInfor.doctorId!);
  await deleteUser(token, doctorInfor.doctorId!);
});

test("should fail to get without clinicId", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-detail-doctor-by-specialty-id`
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing required paramter: specialtyId");
});

test("should fail to get with invalid id", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-detail-doctor-by-specialty-id`,
    { params: { specialtyId: `invalid_id ${doctorInfor.specialtyId}` } }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("Doctor infor not found");
});

test("should get detail doctor by specialty-id successfully", async ({
  request,
}) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-detail-doctor-by-specialty-id`,
    { params: { specialtyId: doctorInfor.specialtyId } }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.doctorInfors.length).toBeGreaterThanOrEqual(1);
  expect(data.doctorInfors[0].specialtyId).toBe(doctorInfor.specialtyId);
  expect(data.doctorInfors[0]).toHaveProperty("priceData");
  expect(data.doctorInfors[0]).toHaveProperty("paymentData");
  expect(data.doctorInfors[0]).toHaveProperty("clinicData");
  expect(data.doctorInfors[0]).toHaveProperty("specialtyData");
});
