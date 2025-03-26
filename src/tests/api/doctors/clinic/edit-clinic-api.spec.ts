import { test, expect } from "../../../../fixtures/base-test";
import path from "path";
import {
  createClinicByApi,
  deleteClinicByApi,
} from "../../../../utils/doctorHelper";
import { ClinicDataType, randomClinicData } from "../../../testData/clinicData";
import { Clinic } from "../../../../utils/types";
import { convertBufferToBase64 } from "../../../../utils/commonUtils";

const imagePath = path.resolve(__dirname, "../../../testData/image-edit.png");
let token: string;
let clinic: Clinic;
let clinicData: ClinicDataType;

test.beforeAll(async ({ authToken }) => {
  //get token, create a new clinic, create clinicInfor to update
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  clinic = await createClinicByApi(token);
  console.log("check clinic id: ", clinic.id);
  clinicData = await randomClinicData(imagePath);
  clinic.address = clinicData.address;
  clinic.descriptionHTML = clinicData.descriptionHTML;
  clinic.descriptionMarkdown = clinicData.descriptionMarkdown;
  clinic.image = clinicData.image;
  clinic.provinceId = clinicData.provinceId;
});

test.afterAll(async () => {
  await deleteClinicByApi(token, clinic.id);
});

test("should fail to edit without id", async ({ request }) => {
  let reClinic = JSON.parse(JSON.stringify(clinic));
  reClinic.id = "";
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-clinic`,
    {
      headers: { Authorization: token },
      data: reClinic,
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing require parameter: name, address, id");
});

test("should fail to edit without name", async ({ request }) => {
  let reClinic = JSON.parse(JSON.stringify(clinic));
  reClinic.name = "";
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-clinic`,
    {
      headers: { Authorization: token },
      data: reClinic,
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing require parameter: name, address, id");
});

test("should fail to edit without address", async ({ request }) => {
  let reClinic = JSON.parse(JSON.stringify(clinic));
  reClinic.address = "";
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-clinic`,
    {
      headers: { Authorization: token },
      data: reClinic,
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing require parameter: name, address, id");
});

test("should fail to edit with invalid id", async ({ request }) => {
  let reClinic = JSON.parse(JSON.stringify(clinic));
  reClinic.id = "invalid id";
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-clinic`,
    {
      headers: { Authorization: token },
      data: reClinic,
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("The clinic is not exist!");
});

test("should fail to edit without authorization", async ({ request }) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-clinic`,
    { data: clinic }
  );
  let data = await response.json();
  expect(response.status()).toEqual(401);
  expect(data.errCode).toEqual(-2);
  expect(data.message).toEqual("Authorization token is required.");
});

test("should fail to delete with invalid authorization", async ({
  request,
}) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-clinic`,
    {
      headers: { Authorization: `Token ${token}` },
      data: clinic,
    }
  );
  let data = await response.json();

  expect(response.status()).toEqual(500);
  expect(data.errCode).toEqual(-3);
  expect(data.message).toEqual("Failed to authenticate token.");
});

test("should edit clinic successfully", async ({ request }) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-clinic`,
    {
      headers: { Authorization: token },
      data: clinic,
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(0);
  expect(data).toHaveProperty("updatedClinic");
  expect(data.updatedClinic.address).toBe(clinic.address);
  expect(convertBufferToBase64(data.updatedClinic.image)).toBe(clinic.image);
  expect(data.updatedClinic.descriptionMarkdown).toBe(
    clinic.descriptionMarkdown
  );
  expect(data.updatedClinic.descriptionHTML).toBe(clinic.descriptionHTML);
});
