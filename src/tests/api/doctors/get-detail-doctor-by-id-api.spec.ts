import { test, expect } from "../../../fixtures/base-test";
import { deleteDoctorInfor, deleteUser } from "../../../utils/helper";

let token: string;
let doctorInfor: any;

//Get doctor infor from Users table
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
