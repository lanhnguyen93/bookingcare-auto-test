import { test, expect } from "../../../fixtures/base-text-api";
import { createRandomDoctorInfor, createUser } from "../../../utils/helper";

let token: string;
let doctorId: string;
let doctor: any;
let doctorInfor: any;

test.beforeAll(async ({ request, authToken }) => {
  //get token, create a new user, doctorInfor for this user, create updated doctorInfor
  //get token
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";

  //create a new user
  let user = await createUser(token, "Doctor");
  console.log(
    `check create user: email = ${user.email}, userId-doctorId - ${user.id}`
  );
  doctorId = user.id;

  //create doctorInfor for this user
  doctorInfor = await createRandomDoctorInfor();
  doctorInfor.doctorId = doctorId;
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: doctorInfor,
    }
  );
  let data = await response.json();
  if (response.status() !== 201 || data.errCode !== 0) {
    throw new Error("Fail to create doctor infor");
  }
  doctor = data.doctor;

  //create updated doctorInfor
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

  //Teardown - delete doctor infor
  //Todo
});

test("should fail to create without doctorId", async ({ request }) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: {
        // doctorId: doctorId,
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

  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual(
    "Missing required paramters: doctorId or description or content"
  );
});

test("should fail to create without description", async ({ request }) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: {
        doctorId: doctorId,
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

  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual(
    "Missing required paramters: doctorId or description or content"
  );
});

test("should fail to create without contentHTML", async ({ request }) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: {
        doctorId: doctorId,
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

  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual(
    "Missing required paramters: doctorId or description or content"
  );
});

test("should fail to create without contentMarkdown", async ({ request }) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: {
        doctorId: doctorId,
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

  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual(
    "Missing required paramters: doctorId or description or content"
  );
});

test("should fail to create a user without authorization", async ({
  request,
}) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-detail-info-doctor`,
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
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-detail-info-doctor`,
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

test("should edit detail infor doctor successfully", async ({ request }) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-detail-info-doctor`,
    {
      headers: { Authorization: token },
      data: doctorInfor,
    }
  );

  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(0);
  expect(data.doctor.priceId).toBe(doctorInfor.priceId);
  expect(data.doctor.paymentId).toBe(doctorInfor.paymentId);
  expect(data.doctor.provinceId).toBe(doctorInfor.provinceId);
  expect(data.doctor.specialtyId).toBe(doctorInfor.specialtyId);
  expect(data.doctor.contentMarkdown).toBe(doctorInfor.contentMarkdown);
  expect(data.doctor.description).toBe(doctorInfor.description);
  expect(data.doctor.note).toBe(doctorInfor.note);
});
