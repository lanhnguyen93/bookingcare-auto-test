import { expect, test } from "@playwright/test";

test("should get top doctors with limit successfully", async ({ request }) => {
  const limit = 5;
  const response = await request.get(
    `${process.env.SERVER_URL}/api/top-doctor-home`,
    { params: { limit: limit } }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toBe(0);
  expect(data.data.length).toBeLessThanOrEqual(limit);
  expect(data.data[0].roleId).toBe("R2");
});

test("should get top doctors without limit successfully", async ({
  request,
}) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/top-doctor-home`
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toBe(0);
  expect(data.data.length).toBeLessThanOrEqual(
    parseInt(process.env.DOCTOR_LIMIT || "0", 10)
  );
  expect(data.data[0].roleId).toBe("R2");
});
