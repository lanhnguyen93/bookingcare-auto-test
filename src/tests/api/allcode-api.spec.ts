import { expect, test } from "@playwright/test";
import { randomValue } from "../../utils/commonUtils";

test("should fail to get with invalid type", async ({ request }) => {
  const response = await request.get(`${process.env.SERVER_URL}/api/allcode`, {
    params: { type: "invalid type" },
  });
  let data = await response.json();
  expect(response.status()).toEqual(200);
  expect(data.errCode).toEqual(1);
  expect(data.message).toEqual("Data not found!");
});

test("should get allcode successfully", async ({ request }) => {
  //get allcode without type
  const response_1 = await request.get(`${process.env.SERVER_URL}/api/allcode`);
  let data_1 = await response_1.json();
  expect(response_1.status()).toEqual(200);
  expect(data_1.errCode).toBe(0);
  expect(data_1.message).toBe("Get allcodes!");

  //get allcode with type
  const allcodes = data_1.data;
  const type = randomValue(allcodes).type;
  const response_2 = await request.get(
    `${process.env.SERVER_URL}/api/allcode`,
    { params: { type: type } }
  );
  let data_2 = await response_2.json();
  expect(response_2.status()).toEqual(200);
  expect(data_2.errCode).toBe(0);
  expect(data_2.message).toBe("OK");
});
