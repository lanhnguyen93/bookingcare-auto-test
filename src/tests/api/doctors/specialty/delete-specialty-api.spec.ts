import { test, expect } from "../../../../fixtures/base-test";
import { createSpecialtyByApi } from "../../../../utils/doctorHelper";

let specialtyId: string;
let token: string;

test.beforeAll(async ({ authToken }) => {
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  let specialty = await createSpecialtyByApi(token);
  specialtyId = specialty.id!;
  console.log("check specialty id: ", specialtyId);
});

test("should fail to delete without id", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-specialty`,
    { headers: { Authorization: token } }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("Missing required parameter");
});

test("should fail to delete with invalid id", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-specialty`,
    {
      headers: { Authorization: token },
      params: { id: `invalid_id${specialtyId}` },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("The specialty is not exist!");
});

test("should fail to delete without authorization", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-specialty`,
    { params: { id: specialtyId } }
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
    `${process.env.SERVER_URL}/api/delete-specialty`,
    {
      headers: { Authorization: `Token ${token}` },
      params: { id: specialtyId },
    }
  );
  let data = await response.json();

  expect(response.status()).toEqual(500);
  expect(data.errCode).toEqual(-3);
  expect(data.message).toEqual("Failed to authenticate token.");
});

test("should delete specialty successfully", async ({ request }) => {
  const response = await request.delete(
    `${process.env.SERVER_URL}/api/delete-specialty`,
    {
      headers: { Authorization: token },
      params: { id: specialtyId },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(0);
  expect(data).toHaveProperty("specialty");
});
