import { test, expect } from "../../../../fixtures/base-test";
import {
  createSpecialtyByApi,
  deleteSpecialtyByApi,
} from "../../../../utils/doctorHelper";

let token: string;

test("should get all specialties successfully", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-all-specialty`,
    { params: { id: "ALL" } }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.specialties.length).toBeGreaterThanOrEqual(1);
  expect(data.specialties[0]).toHaveProperty("name");
  expect(data.specialties[0]).toHaveProperty("image");
  expect(data.specialties[0]).toHaveProperty("descriptionMarkdown");
  expect(data.specialties[0]).toHaveProperty("descriptionHTML");
});

test("should get specialty by id successfully", async ({ request }) => {
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  const specialty = await createSpecialtyByApi(token);
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-all-specialty`,
    { params: { id: specialty.id! } }
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(0);
  expect(data.specialties.name).toBe(specialty.name);

  //teardown - delete specialty
  await deleteSpecialtyByApi(token, specialty.id);
});

test("should fail to get specialty without id", async ({ request }) => {
  const response = await request.get(
    `${process.env.SERVER_URL}/api/get-all-specialty`
  );
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toBe("Missing required paramter");
});
