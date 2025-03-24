import { test, expect } from "../../../../fixtures/base-test";
import { deleteClinicByApi } from "../../../../utils/doctorHelper";
import { ClinicDataType, randomClinicData } from "../../../testData/clinicData";

let token: string;
let clinicData: ClinicDataType;

test.beforeAll(async ({ authToken }) => {
  //get token, create clinic infor
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  clinicData = await randomClinicData();
  console.log("check clinic Infor: ", clinicData.name);
});

test("should fail to create without clinic name ", async ({ request }) => {
  let reClinicData = JSON.parse(JSON.stringify(clinicData));
  reClinicData.name = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-clinic`,
    {
      data: reClinicData,
      headers: { Authorization: token },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing required paramters: name or address");
});

test("should fail to create without clinic address ", async ({ request }) => {
  let reClinicData = JSON.parse(JSON.stringify(clinicData));
  reClinicData.address = "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-clinic`,
    {
      data: reClinicData,
      headers: { Authorization: token },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing required paramters: name or address");
});

test("should fail to create without authorization", async ({ request }) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-clinic`,
    {
      data: clinicData,
      // headers: { Authorization: token },
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(401);
  expect(data.errCode).toEqual(-2);
  expect(data.message).toEqual("Authorization token is required.");
});

test("should fail to create a user with invalid authorization", async ({
  request,
}) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-clinic`,
    {
      data: clinicData,
      headers: { Authorization: `Token ${token}` },
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(500);
  expect(data.errCode).toEqual(-3);
  expect(data.message).toEqual("Failed to authenticate token.");
});

test("should create clinic successfully", async ({ request }) => {
  //Create clinic successfully
  const response_1 = await request.post(
    `${process.env.SERVER_URL}/api/create-clinic`,
    {
      data: clinicData,
      headers: { Authorization: token },
    }
  );
  let data_1 = await response_1.json();
  expect(response_1.status()).toEqual(200);
  expect(data_1.errCode).toEqual(0);
  expect(data_1).toHaveProperty("clinic");

  //Create clinic with existed name
  const response_2 = await request.post(
    `${process.env.SERVER_URL}/api/create-clinic`,
    {
      data: { name: clinicData.name, address: clinicData.address },
      headers: { Authorization: token },
    }
  );
  let data_2 = await response_2.json();
  expect(response_2.status()).toEqual(200);
  expect(data_2.errCode).toEqual(2);
  expect(data_2.message).toEqual("The clinic already exists!");

  //teardown - delete clinic
  await deleteClinicByApi(token, data_1.clinic.id);
});
