import { test, expect } from "../../../../fixtures/base-test";
import {
  createClinicByApi,
  deleteClinicByApi,
} from "../../../../utils/doctorHelper";

let token: string;
let clinic: any;

test("should get all clinics successfully", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-all-clinics`,
    { params: { id: "ALL" } }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.clinics.length).toBeGreaterThanOrEqual(1);
  expect(data.clinics[0]).toHaveProperty("name");
  expect(data.clinics[0]).toHaveProperty("address");
  expect(data.clinics[0]).toHaveProperty("descriptionMarkdown");
  expect(data.clinics[0]).toHaveProperty("descriptionHTML");
  expect(data.clinics[0]).toHaveProperty("provinceId");
  expect(data.clinics[0]).toHaveProperty("image");
});

test("should get clinic by id successfully", async ({ request }) => {
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  clinic = await createClinicByApi(token); //Create a new clinic
  console.log("check clinicId: ", clinic.id);
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-all-clinics`,
    { params: { id: clinic.id! } }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(0);
  expect(data.clinics.name).toBe(clinic.name);

  //teardown - delete clinic
  await deleteClinicByApi(token, clinic.id);
});

test("should fail to get clinic without id", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-all-clinics`
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toBe("Missing required paramter");
});
