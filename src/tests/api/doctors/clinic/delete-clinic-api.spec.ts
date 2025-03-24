import { test, expect } from "../../../../fixtures/base-test";
import { createClinicByApi } from "../../../../utils/doctorHelper";
import { Clinic } from "../../../../utils/types";

let clinicId: string;
let token: string;
let clinic: Clinic;

test.beforeAll(async ({ authToken }) => {
  //get token, create a clinic
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  clinic = await createClinicByApi(token);
  clinicId = clinic.id!;
  console.log("check clinic id: ", clinicId);
});

test("should fail to delete without id", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-clinic`,
    { headers: { Authorization: token } }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("Missing required parameter");
});

test("should fail to delete with invalid id", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-clinic`,
    {
      headers: { Authorization: token },
      params: { id: `invalid_id${clinicId}` },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("The clinic is not exist!");
});

test("should fail to delete without authorization", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-clinic`,
    { params: { id: clinicId } }
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
    `${process.env.SERVER_URL}/api/delete-clinic`,
    {
      headers: { Authorization: `Token ${token}` },
      params: { id: clinicId },
    }
  );
  let data = await response.json();

  expect(response.status()).toEqual(500);
  expect(data.errCode).toEqual(-3);
  expect(data.message).toEqual("Failed to authenticate token.");
});

test("should delete clinic successfully", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-clinic`,
    {
      headers: { Authorization: token },
      params: { id: clinicId },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(0);
  expect(data).toHaveProperty("clinic");
});
