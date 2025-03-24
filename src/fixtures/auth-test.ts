import { test as base } from "./base-test";

type AuthTestOptions = {
  loginByToken: void;
};

export const test = base.extend<AuthTestOptions>({
  loginByToken: [
    async ({ page }, use) => {
      const token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
      await page.goto("/login");
      await page.evaluate((token) => {
        localStorage.setItem("token", token);
      }, token);
      await page.reload();
      await use();
    },
    { auto: true },
  ],
});
export { expect } from "@playwright/test";
