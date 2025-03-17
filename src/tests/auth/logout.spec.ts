import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/auth/loginPage";
import { UserVuexPage } from "../../pages/system/userVuexPage";
import testData from "../testData/testLoginData.json";
import { NavigationBar } from "../../pages/system/navigationBar";

test.beforeEach(async ({ page }) => {
  //Login via API
  // const loginResponse = await page.route("*/**/api/login", async (route) => {
  //   await route.fulfill({
  //     body: JSON.stringify({
  //       email: "test@gmail.com",
  //       password: "123456",
  //     }),
  //   });
  // });

  //Login via Login page
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.enterCredential(testData.validEmail, testData.validPassword);
  const userVuexPage = new UserVuexPage(page);
  await userVuexPage.waitForLoad();
});

test("logout successfully", async ({ page }) => {
  const navigationBar = new NavigationBar(page);
  await navigationBar.logoutButton.click();
  await expect(page).toHaveTitle("Login");

  const userVuexPage = new UserVuexPage(page);
  await userVuexPage.goto();
  expect(page.url()).toContain(`/login?redirect=${userVuexPage.pageUrl}`);
});
