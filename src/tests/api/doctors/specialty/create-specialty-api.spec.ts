import { test, expect } from "../../../../fixtures/base-test";
import { deleteSpecialtyByApi } from "../../../../utils/doctorHelper";
import { randomSpecialtyData, SpecialtyDataType } from "../../../testData/specialtyData";

let token: string;
let specialtyData: SpecialtyDataType;

test.beforeAll(async ({ authToken }) => {
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  specialtyData = randomSpecialtyData();
  console.log("check specialtyInfor: ", specialtyData.name);
});

test("should fail to create without specialty name ", async ({ request }) => {
  let reSpecialtyData = JSON.parse(JSON.stringify(specialtyData));
  reSpecialtyData.name = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-specialty`,
    {
      data: reSpecialtyData,
      headers: { Authorization: token },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing required paramters: name");
});

test("should fail to create without authorization", async ({ request }) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-specialty`,
    { data: specialtyData }
  );

  let data = await response.json();

  expect(response.status()).toEqual(401);
  expect(data.errCode).toEqual(-2);
  expect(data.message).toEqual("Authorization token is required.");
});

test("should fail to create with invalid authorization", async ({
  request,
}) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-specialty`,
    {
      data: specialtyData,
      headers: { Authorization: `Token ${token}` },
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(500);
  expect(data.errCode).toEqual(-3);
  expect(data.message).toEqual("Failed to authenticate token.");
});

test("should create specialty successfully", async ({ request }) => {
  //Create specialty successfully
  const response_1 = await request.post(
    `${process.env.SERVER_URL}/api/create-specialty`,
    {
      data: specialtyData,
      headers: { Authorization: token },
    }
  );
  let data_1 = await response_1.json();
  expect(response_1.status()).toEqual(200);
  expect(data_1.errCode).toEqual(0);
  expect(data_1).toHaveProperty("specialty");

  //Create specialty with existed name
  let reSpecialtyData = randomSpecialtyData();
  reSpecialtyData.name = specialtyData.name;
  const response_2 = await request.post(
    `${process.env.SERVER_URL}/api/create-specialty`,
    { data: reSpecialtyData, headers: { Authorization: token } }
  );
  let data_2 = await response_2.json();
  expect(response_2.status()).toEqual(200);
  expect(data_2.errCode).toEqual(2);
  expect(data_2.message).toEqual("The specialty already exists!");

  //teardown - delete specialty
  await deleteSpecialtyByApi(token, data_1.specialty.id);
});
