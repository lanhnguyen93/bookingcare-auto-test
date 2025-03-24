import { test, expect } from "../../../fixtures/base-test";
import { deleteUserByApi } from "../../../utils/userHelper";
import { randomUserData, UserDataType } from "../../testData/userData";

let token: string;
let userEmail: string;
let userId: string;
let userData: UserDataType;

test.beforeAll(async ({ authToken, createAdmin }) => {
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  userEmail = createAdmin.email;
  userId = createAdmin.id;
  userData = randomUserData();
  userData.email = userEmail;
  console.log("check userEmail: ", userEmail);
});

test.afterAll(async () => {
  await deleteUserByApi(token, userId);
});

test("should fail to edit without email", async ({ request }) => {
  let reUserData = JSON.parse(JSON.stringify(userData));
  reUserData.email = "";
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-user`,
    {
      headers: { Authorization: token },
      data: reUserData,
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Missing required parameter: email");
});

test("should fail to edit with invalid email", async ({ request }) => {
  let reUserData = JSON.parse(JSON.stringify(userData));
  reUserData.email = "invalid email";
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-user`,
    {
      headers: { Authorization: token },
      data: reUserData,
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(2);
  expect(data.message).toEqual("The user is not exist!");
});

test("should fail to edit without authorization", async ({ request }) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-user`,
    { data: userData }
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
    `${process.env.SERVER_URL}/api/edit-user`,
    {
      headers: { Authorization: `Token ${token}` },
      data: userData,
    }
  );
  let data = await response.json();

  expect(response.status()).toEqual(500);
  expect(data.errCode).toEqual(-3);
  expect(data.message).toEqual("Failed to authenticate token.");
});

test("should edit user successfully", async ({ request }) => {
  const response = await request.put(
    `${process.env.SERVER_URL}/api/edit-user`,
    {
      headers: { Authorization: token },
      data: {
        email: userEmail,
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: userData.address,
        phonenumber: userData.phonenumber,
        gender: userData.gender,
        roleId: userData.roleId,
        positionId: userData.positionId,
      },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(0);
  expect(data).toHaveProperty("updatedUser");
  expect(data.updatedUser.email).toBe(userEmail);
  expect(data.updatedUser.firstName).toBe(userData.firstName);
  expect(data.updatedUser.lastName).toBe(userData.lastName);
  expect(data.updatedUser.address).toBe(userData.address);
  expect(data.updatedUser.phonenumber).toBe(userData.phonenumber);
  expect(data.updatedUser.gender).toBe(userData.gender);
  expect(data.updatedUser.roleId).toBe(userData.roleId);
});
