import { expect, test } from "@playwright/test";

test("should get all doctors successfully", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-all-doctors`
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.data.length).toBeGreaterThanOrEqual(1);
  expect(data.data[0].roleId).toBe("R2");
  expect(data.data[0]).toHaveProperty("id");
  expect(data.data[0]).toHaveProperty("email");
  expect(data.data[0]).toHaveProperty("firstName");
  expect(data.data[0]).toHaveProperty("lastName");
  expect(data.data[0]).toHaveProperty("address");
  expect(data.data[0]).toHaveProperty("gender");
  expect(data.data[0]).toHaveProperty("positionId");
  expect(data.data[0]).not.toHaveProperty("password");
  expect(data.data[0]).not.toHaveProperty("phonenumber");
});
