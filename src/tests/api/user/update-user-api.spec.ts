import { request } from "http";
import { test, expect } from "../../../fixtures/base-text-api";
import { createRandomUserInfor } from "../../../utils/helper";

let token: string;
let userEmail: string;
let userId: string;
let user: any;

test.describe("Delete User API", () => {
  test.beforeAll(async ({ authToken, createUser }) => {
    token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
    userEmail = createUser.email;
    userId = createUser.id;
    user = createRandomUserInfor();
    console.log("check userEmail: ", userEmail);
  });

  test.afterAll(async ({ request }) => {
    const response = await request.delete(
      `${process.env.SERVER_URL}/api/delete-user`,
      {
        headers: { Authorization: token },
        params: { id: userId },
      }
    );
    let data = await response.json();
    if (response.status() !== 200 || data.errCode !== 0) {
      throw new Error("Fail to delete user");
    }
  });

  test("should fail to edit without email", async ({ request }) => {
    const response = await request.put(
      `${process.env.SERVER_URL}/api/edit-user`,
      {
        headers: { Authorization: token },
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
        },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(1);
    expect(data.message).toEqual("Missing required parameter: email");
  });

  test("should fail to edit with invalid email", async ({ request }) => {
    const response = await request.put(
      `${process.env.SERVER_URL}/api/edit-user`,
      {
        headers: { Authorization: token },
        data: {
          email: `${userEmail}-${userEmail}`,
          firstName: user.firstName,
          lastName: user.lastName,
        },
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
      {
        data: {
          email: userEmail,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      }
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
        data: {
          email: userEmail,
          firstName: user.firstName,
          lastName: user.lastName,
        },
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
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
          phonenumber: user.phonenumber,
          gender: user.gender,
          roleId: user.roleId,
          positionId: user.positionId,
        },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(0);
    expect(data).toHaveProperty("updatedUser");
    expect(data.updatedUser.email).toBe(userEmail);
    expect(data.updatedUser.firstName).toBe(user.firstName);
    expect(data.updatedUser.lastName).toBe(user.lastName);
    expect(data.updatedUser.address).toBe(user.address);
    expect(data.updatedUser.phonenumber).toBe(user.phonenumber);
    expect(data.updatedUser.gender).toBe(user.gender);
    expect(data.updatedUser.roleId).toBe(user.roleId);
    expect(data.updatedUser.positionId).toBe(user.positionId);
  });
});
