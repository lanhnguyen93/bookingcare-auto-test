import { test, expect } from "../../../fixtures/base-test-api";
import { createRandomDoctorInfor, createUser } from "../../../utils/helper";

let token: string;
let doctorId: string;
let doctorInfor: any;

test.beforeAll(async ({ authToken }) => {
  //get token, create a new user, doctorInfor
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  let user = await createUser(token, "Doctor");
  console.log(
    `check create user: email = ${user.email}, userId-doctorId - ${user.id}`
  );
  doctorId = user.id;
  doctorInfor = await createRandomDoctorInfor();
  doctorInfor.doctorId = doctorId;
});

test.afterAll(async ({ request }) => {
  //Teardown - delete user after creating
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-user`,
    {
      headers: { Authorization: token },
      params: { id: doctorId },
    }
  );
  const data = await response.json();
  if (response.status() !== 200 || data.errCode !== 0) {
    throw new Error("Fail to delete user");
  }
});

test("should fail to create without doctorId", async ({ request }) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: {
        // doctorId: doctorInfor.doctorId,
        priceId: doctorInfor.priceId,
        paymentId: doctorInfor.paymentId,
        provinceId: doctorInfor.provinceId,
        clinicId: doctorInfor.clinicId,
        specialtyId: doctorInfor.specialtyId,
        contentHTML: doctorInfor.contentHTML,
        contentMarkdown: doctorInfor.contentMarkdown,
        description: doctorInfor.description,
        note: doctorInfor.note,
      },
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(201);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual(
    "Missing required paramters: doctorId or description or content"
  );
});

test("should fail to create without description", async ({ request }) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: {
        doctorId: doctorInfor.doctorId,
        priceId: doctorInfor.priceId,
        paymentId: doctorInfor.paymentId,
        provinceId: doctorInfor.provinceId,
        clinicId: doctorInfor.clinicId,
        specialtyId: doctorInfor.specialtyId,
        contentHTML: doctorInfor.contentHTML,
        contentMarkdown: doctorInfor.contentMarkdown,
        // description: doctorInfor.description,
        note: doctorInfor.note,
      },
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(201);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual(
    "Missing required paramters: doctorId or description or content"
  );
});

test("should fail to create without contentHTML", async ({ request }) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: {
        doctorId: doctorInfor.doctorId,
        priceId: doctorInfor.priceId,
        paymentId: doctorInfor.paymentId,
        provinceId: doctorInfor.provinceId,
        clinicId: doctorInfor.clinicId,
        specialtyId: doctorInfor.specialtyId,
        // contentHTML: doctorInfor.contentHTML,
        contentMarkdown: doctorInfor.contentMarkdown,
        description: doctorInfor.description,
        note: doctorInfor.note,
      },
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(201);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual(
    "Missing required paramters: doctorId or description or content"
  );
});

test("should fail to create without contentMarkdown", async ({ request }) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: {
        doctorId: doctorInfor.doctorId,
        priceId: doctorInfor.priceId,
        paymentId: doctorInfor.paymentId,
        provinceId: doctorInfor.provinceId,
        clinicId: doctorInfor.clinicId,
        specialtyId: doctorInfor.specialtyId,
        contentHTML: doctorInfor.contentHTML,
        // contentMarkdown: doctorInfor.contentMarkdown,
        description: doctorInfor.description,
        note: doctorInfor.note,
      },
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(201);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual(
    "Missing required paramters: doctorId or description or content"
  );
});

test("should fail to create a user without authorization", async ({
  request,
}) => {
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
    doctorInfor
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
    `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
    {
      headers: { Authorization: `Token ${token}` },
      data: doctorInfor,
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(500);
  expect(data.errCode).toEqual(-3);
  expect(data.message).toEqual("Failed to authenticate token.");
});

test("should create detail infor doctor successfully", async ({ request }) => {
  const response_1 = await request.post(
    `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: doctorInfor,
    }
  );

  let data_1 = await response_1.json();
  expect(response_1.status()).toEqual(201);
  expect(data_1.errCode).toEqual(0);
  expect(data_1).toHaveProperty("doctor");

  //should fail to create with existed doctor
  const response_2 = await request.post(
    `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: doctorInfor,
    }
  );

  let data_2 = await response_2.json();
  expect(response_2.status()).toEqual(201);
  expect(data_2.errCode).toEqual(1);
  expect(data_2.message).toEqual("The doctor already exists!");

  //Teardown - delete doctor infor after creating
  //Todo
});
