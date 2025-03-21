import { test, expect } from "../../../fixtures/base-test-api";
import { createRandomUserInfor } from "../../../utils/helper";

test("should create a user successfully", async ({ request }) => {
  const token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  const user = createRandomUserInfor();
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-new-user`,
    {
      headers: { Authorization: token },
      data: user,
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(201);
  expect(data.errCode).toEqual(0);
  expect(data).toHaveProperty("user");

  //Teardown - delete user after creating
  const deleteResponse = await request.delete(
    `${process.env.SERVER_URL}/api/delete-user`,
    {
      headers: { Authorization: token },
      params: { id: data.user.id },
    }
  );
  expect(deleteResponse.status()).toEqual(200);
});

test("should fail to create without password", async ({ request }) => {
  const token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  const user = createRandomUserInfor();
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-new-user`,
    {
      headers: { Authorization: token },
      data: { email: user.email },
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(201);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("Missing required parameter!");
});

test("should fail to create without email", async ({ request }) => {
  const token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  const user = createRandomUserInfor();
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-new-user`,
    {
      headers: { Authorization: token },
      data: { password: user.password },
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(201);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("Missing required parameter!");
});

test("should fail to create with existed email", async ({ request }) => {
  const token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-new-user`,
    {
      headers: { Authorization: token },
      data: {
        email: process.env.USER_EMAIL,
        password: process.env.USER_PASSWORD,
      },
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(201);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("The email is already in used!");
});

test("should fail to create a user without authorization", async ({
  request,
}) => {
  const token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  const user = createRandomUserInfor();
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-new-user`,
    { data: user }
  );

  let data = await response.json();

  expect(response.status()).toEqual(401);
  expect(data.errCode).toEqual(-2);
  expect(data.message).toEqual("Authorization token is required.");
});

test("should fail to create a user with invalid authorization", async ({
  request,
}) => {
  const token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  const user = createRandomUserInfor();
  const response = await request.post(
    `${process.env.SERVER_URL}/api/create-new-user`,
    {
      headers: { Authorization: `Token ${token}` },
      data: user,
    }
  );

  let data = await response.json();

  expect(response.status()).toEqual(500);
  expect(data.errCode).toEqual(-3);
  expect(data.message).toEqual("Failed to authenticate token.");
});
