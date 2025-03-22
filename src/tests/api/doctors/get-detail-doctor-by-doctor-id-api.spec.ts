import { test, expect } from "../../../fixtures/base-test";
import { deleteDoctorInfor, deleteUser } from "../../../utils/helper";

let token: string;
let doctorInfor: any;

//Get doctor infor from DoctorInfor table
test.beforeAll(async ({ authToken, createDoctorInfor }) => {
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";

  //create booking
  doctorInfor = createDoctorInfor;
  console.log("check doctorInfor: ", doctorInfor);
});

test.afterAll(async () => {
  await deleteDoctorInfor(token, doctorInfor.doctorId!);
  await deleteUser(token, doctorInfor.doctorId!);
});

test("should fail to get without id", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-detail-doctor-by-doctor-id`
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing required paramter!");
});

test("should fail to get with invalid id", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-detail-doctor-by-doctor-id`,
    { params: { doctorId: `invalid_id ${doctorInfor.doctorId}` } }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("Doctor infor not found");
});

test("should get detail doctor by doctorId successfully", async ({
  request,
}) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-detail-doctor-by-doctor-id`,
    { params: { doctorId: doctorInfor.doctorId } }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.doctorInfor.doctorId).toBe(doctorInfor.doctorId);
  expect(data.doctorInfor).toHaveProperty("priceData");
  expect(data.doctorInfor).toHaveProperty("paymentData");
  expect(data.doctorInfor).toHaveProperty("clinicData");
  expect(data.doctorInfor).toHaveProperty("specialtyData");
});
