import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/auth/loginPage";
import { UserVuexPage } from "../../pages/system/userVuexPage";
import testData from "../testData/testLoginData.json";
import { NavigationBar } from "../../pages/system/navigationBar";
import { beforeEach } from "node:test";

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

test.describe("Login fail", () => {
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
});

test("Redirect to login page when not logged in", async ({ page }) => {
  const userVuexPage = new UserVuexPage(page);
  await userVuexPage.goto();
  expect(page.url()).toContain(`/login?redirect=${userVuexPage.pageUrl}`);

  const loginPage = new LoginPage(page);
  await loginPage.enterCredential(testData.validEmail, testData.validPassword);
  await userVuexPage.waitForLoad();
});

test("Verify stay logged in after login", async ({ page, context }) => {
  const loginPage = new LoginPage(page);
  await loginPage.enterCredential(testData.validEmail, testData.validPassword);

  const userVuexPage = new UserVuexPage(page);
  await userVuexPage.waitForLoad();

  await page.close();
  const newPage = await context.newPage();
  await newPage.goto(userVuexPage.pageUrl);
  await expect(newPage).toHaveTitle("User Vuex");
});

test("Should have welcome text in the navigation bar", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.enterCredential(testData.validEmail, testData.validPassword);

  const userVuexPage = new UserVuexPage(page);
  await userVuexPage.waitForLoad();

  const navigationBar = new NavigationBar(page);
  const userInfor = await page.evaluate(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });
  await expect(navigationBar.greetingText).toHaveText(
    `Xin chào,  ${userInfor.user.firstName} ${userInfor.user.lastName}`
  );
});
