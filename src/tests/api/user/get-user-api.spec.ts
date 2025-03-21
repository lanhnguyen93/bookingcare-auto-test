import { test, expect } from "../../../fixtures/base-test-api";
import user from "../../../../.auth/user.json";

test("should get all users successfully", async ({ request }) => {
  const token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-all-users`,
    {
      headers: { Authorization: token },
      params: { id: "ALL" },
    }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.users.length).toBeGreaterThanOrEqual(1);
  expect(data.users[0]).toHaveProperty("id");
  expect(data.users[0]).toHaveProperty("email");
  expect(data.users[0]).toHaveProperty("image");
  expect(data.users[0]).not.toHaveProperty("password");
});

test("should get user by id successfully", async ({ request }) => {
  const token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  let userId = user.userInfor.id;
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-all-users`,
    {
      headers: { Authorization: token },
      params: { id: userId },
    }
  );
  let data = await response.json();

  expect(response.status()).toEqual(200);
  expect(data.users.id).toEqual(userId);
  expect(data.users).not.toHaveProperty("password");
});

test("should fail to get users without id", async ({ request }) => {
  const token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-all-users`,
    { headers: { Authorization: token } }
  );

  let data = await response.json();

  expect(response.status()).toEqual(400);
  expect(data.errCode).toEqual(1);
  expect(data.message).toBe("Missing id parameter");
});

test("should fail to get users without authorization", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-all-users`,
    { params: { id: "ALL" } }
  );
  let data = await response.json();

  expect(response.status()).toEqual(401);
  expect(data.errCode).toEqual(-2);
  expect(data.message).toBe("Authorization token is required.");
});

test("should be fail with invalid authorization", async ({ request }) => {
  const token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-all-users`,
    {
      headers: { Authorization: `Token ${token}` },
      params: { id: "ALL" },
    }
  );
  let data = await response.json();

  expect(response.status()).toEqual(500);
  expect(data.errCode).toEqual(-3);
  expect(data.message).toBe("Failed to authenticate token.");
});
