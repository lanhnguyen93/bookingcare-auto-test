import { test as base } from "@playwright/test";
import { Page } from "../pages/basePage";
import fs from "fs";
import { createRandomUserInfor } from "../utils/helper";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phonenumber: string;
  gender: string;
  image: string;
  roleId: string;
  positionId: string;
};

type TestOptions = {
  page: Page;
  authToken: string;
  createUser: User;
};

const authFile = ".auth/user.json";

export const test = base.extend<TestOptions>({
  authToken: [
    async ({ request }, use) => {
      const response = await request.post(
        `${process.env.SERVER_URL}/api/login`,
        {
          data: {
            email: process.env.USER_EMAIL,
            password: process.env.USER_PASSWORD,
          },
        }
      );
      let data = await response.json();
      if (response.status() !== 200 || !data.token) {
        throw new Error("Failed to login and get token");
      }
      fs.writeFileSync(authFile, JSON.stringify(data));
      process.env["ACCESS_TOKEN"] = data.token;
      await use("");
    },
    { auto: true },
  ],

  createUser: async ({ request }, use) => {
    const randomUser = createRandomUserInfor();
    const response = await request.post(
      `${process.env.SERVER_URL}/api/create-new-user`,
      {
        headers: { Authorization: process.env.ACCESS_TOKEN || "" },
        data: randomUser,
      }
    );
    let data = await response.json();
    const userFile = "src/tests/api/testData/createUser.json";
    fs.writeFileSync(userFile, JSON.stringify(data.user));
    await use(data.user);
  },

  page: async ({ page }, use) => {
    await use(page);
  },
});
export { expect } from "@playwright/test";
