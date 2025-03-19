import { test, expect } from "../../../fixtures/base-text-api";

let token: string;
let userId: string;

test.describe("Delete User API", () => {
  test.beforeAll(async ({ authToken, createUser }) => {
    token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
    userId = createUser.id;
    console.log("check userId: ", userId);
  });

  test("should fail to delete without id", async ({ request }) => {
    const response = await request.delete(
      `${process.env.SERVER_URL}/api/delete-user`,
      {
        headers: { Authorization: token },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(2);
    expect(data.message).toEqual("Missing required parameter");
  });

  test("should fail to delete with invalid id", async ({ request }) => {
    const response = await request.delete(
      `${process.env.SERVER_URL}/api/delete-user`,
      {
        headers: { Authorization: token },
        params: { id: `invalid_id${userId}` },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(1);
    expect(data.message).toEqual("The user is not exist!");
  });

  test("should fail to delete without authorization", async ({ request }) => {
    const response = await request.delete(
      `${process.env.SERVER_URL}/api/delete-user`,
      { params: { id: userId } }
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
      `${process.env.SERVER_URL}/api/delete-user`,
      {
        headers: { Authorization: `Token ${token}` },
        params: { id: userId },
      }
    );
    let data = await response.json();

    expect(response.status()).toEqual(500);
    expect(data.errCode).toEqual(-3);
    expect(data.message).toEqual("Failed to authenticate token.");
  });

  test("should delete user successfully", async ({ request }) => {
    const response = await request.delete(
      `${process.env.SERVER_URL}/api/delete-user`,
      {
        headers: { Authorization: token },
        params: { id: userId },
      }
    );
    let data = await response.json();
    expect(response.status()).toEqual(200);
    expect(data.errCode).toEqual(0);
    expect(data).toHaveProperty("user");
  });
});
