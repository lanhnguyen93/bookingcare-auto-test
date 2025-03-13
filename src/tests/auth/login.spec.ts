import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/auth/loginPage";
import { UserVuexPage } from "../../pages/system/userVuexPage";
import testData from "../testData/testLoginData.json";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
});

test("Verify login successfully", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.enterCredential(testData.validEmail, testData.validPassword);

  const userVuexPage = new UserVuexPage(page);
  await userVuexPage.waitForLoad();
});

test("Verify when missing email", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.enterCredential("", testData.validPassword);
  await expect(loginPage.errorMessage).toHaveText("Missing input parameter");
});

test("Verify when missing password", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.enterCredential(testData.validEmail, "");
  await expect(loginPage.errorMessage).toHaveText("Missing input parameter");
});

test("Verify when enter non-existen email", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.enterCredential(
    testData.invalidEmail,
    testData.validPassword
  );
  await expect(loginPage.errorMessage).toHaveText("The email is not exits!");
});

test("Verify when enter wrong password", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.enterCredential(
    testData.validEmail,
    testData.invalidPassword
  );
  await expect(loginPage.errorMessage).toHaveText(
    "The password is not mapping!"
  );
});
