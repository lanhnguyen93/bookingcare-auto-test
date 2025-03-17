import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../pages/auth/loginPage";
import { UserVuexPage } from "../../../pages/system/userVuexPage";
import testData from "../testData/testLoginData.json";
import { NavigationBar } from "../../../pages/system/navigationBar";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.enterCredential(testData.validEmail, testData.validPassword);
  const userVuexPage = new UserVuexPage(page);
  await userVuexPage.waitForLoad();
});
