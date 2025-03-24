import { test, expect } from "../../../fixtures/base-test";
import { api } from "../../../utils/api";
import { deleteUserByApi } from "../../../utils/userHelper";
import { randomUserData } from "../../testData/userData";

test("should create a user successfully", async () => {
  const token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  const user = randomUserData();

  //verify create successfully
  const response_1 = await api.post(`/api/create-new-user`, user, {
    headers: { Authorization: token },
  });

  let data_1 = await response_1.data;

  expect(response_1.status).toEqual(201);
  expect(data_1.errCode).toEqual(0);
  expect(data_1).toHaveProperty("user");

  //verify fail to create with exist user
  const response_2 = await api.post(`/api/create-new-user`, user, {
    headers: { Authorization: token },
  });

  let data_2 = await response_2.data;

  expect(response_2.status).toEqual(201);
  expect(data_2.errCode).toEqual(1);
  expect(data_2.message).toEqual("The email is already in used!");

  //Teardown - delete user after creating
  await deleteUserByApi(token, data_1.user.id);
});

test("should fail to create without password", async () => {
  const token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  const user = randomUserData();
  user.password = "";
  const response = await api.post(`/api/create-new-user`, user, {
    headers: { Authorization: token },
  });

  let data = await response.data;

  expect(response.status).toEqual(201);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("Missing required parameter!");
});

test("should fail to create without email", async () => {
  const token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  const user = randomUserData();
  user.email = "";
  const response = await api.post(`/api/create-new-user`, user, {
    headers: { Authorization: token },
  });

  let data = await response.data;

  expect(response.status).toEqual(201);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("Missing required parameter!");
});

test("should fail to create a user without authorization", async ({
  request,
}) => {
  const token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  const user = randomUserData();
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
  const user = randomUserData();
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
