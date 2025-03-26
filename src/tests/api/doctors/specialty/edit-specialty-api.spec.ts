import { test, expect } from "../../../../fixtures/base-test";
import path from "path";
import {
  createSpecialtyByApi,
  deleteSpecialtyByApi,
} from "../../../../utils/doctorHelper";
import { convertBufferToBase64 } from "../../../../utils/commonUtils";
import {
  randomSpecialtyData,
  SpecialtyDataType,
} from "../../../testData/specialtyData";
import { Specialty } from "../../../../utils/types";

const imagePath = path.resolve(__dirname, "../../../testData/image-edit.png");
let token: string;
let specialty: Specialty;
let specialtyData: SpecialtyDataType;

test.beforeAll(async ({ authToken }) => {
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  specialty = await createSpecialtyByApi(token);
  console.log("check specialty id: ", specialty.id);

  specialtyData = randomSpecialtyData(imagePath);
  specialty.image = specialtyData.image;
  specialty.descriptionHTML = specialtyData.descriptionHTML;
  specialty.descriptionMarkdown = specialtyData.descriptionMarkdown;
});

test.afterAll(async () => {
  await deleteSpecialtyByApi(token, specialty.id);
});

test("should fail to edit without id", async ({ request }) => {
  let reSpecialty = JSON.parse(JSON.stringify(specialty));
  reSpecialty.id = "";
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-specialty`,
    {
      headers: { Authorization: token },
      data: reSpecialty,
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing require parameter: name, id");
});

test("should fail to edit without name", async ({ request }) => {
  let reSpecialty = JSON.parse(JSON.stringify(specialty));
  reSpecialty.name = "";
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-specialty`,
    {
      headers: { Authorization: token },
      data: reSpecialty,
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing require parameter: name, id");
});

test("should fail to edit with invalid id", async ({ request }) => {
  let reSpecialty = JSON.parse(JSON.stringify(specialty));
  reSpecialty.id = "invalid";
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-specialty`,
    {
      headers: { Authorization: token },
      data: reSpecialty,
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("The specialty is not exist!");
});

test("should fail to edit without authorization", async ({ request }) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-specialty`,
    { data: specialty }
  );
  let data = await response.json();
  expect(response.status()).toEqual(401);
  expect(data.errCode).toEqual(-2);
  expect(data.message).toEqual("Authorization token is required.");
});

test("should fail to edit with invalid authorization", async ({ request }) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-specialty`,
    {
      headers: { Authorization: `Token ${token}` },
      data: specialty,
    }
  );
  let data = await response.json();

  expect(response.status()).toEqual(500);
  expect(data.errCode).toEqual(-3);
  expect(data.message).toEqual("Failed to authenticate token.");
});

test("should edit specialty successfully", async ({ request }) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-specialty`,
    {
      headers: { Authorization: token },
      data: specialty,
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(0);
  expect(data).toHaveProperty("updatedSpecialty");
  expect(convertBufferToBase64(data.updatedSpecialty.image)).toBe(
    specialty.image
  );
  expect(data.updatedSpecialty.descriptionMarkdown).toBe(
    specialty.descriptionMarkdown
  );
  expect(data.updatedSpecialty.descriptionHTML).toBe(specialty.descriptionHTML);
});
