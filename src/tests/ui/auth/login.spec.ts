import { test, expect } from "../../../fixtures/base-test";
import { LoginPage } from "../../../pages/auth/loginPage";
import { UserVuexPage } from "../../../pages/system/userVuexPage";
import { NavigationBar } from "../../../pages/system/navigationBar";
import { User } from "../../../utils/types";
import { createUserByApi, deleteUserByApi } from "../../../utils/userHelper";
import { ManageSchedulePage } from "../../../pages/system/manageSchedulePage";
import { testLoginData } from "../../testData/loginData";

let token: string;
let adminUser: User;
let doctorUser: User;
let patientUser: User;

test.beforeAll(async ({ authToken }) => {
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  adminUser = await createUserByApi(token, "Admin");
  doctorUser = await createUserByApi(token, "Doctor");
  patientUser = await createUserByApi(token, "Patient");
});

test.afterAll(async () => {
  await deleteUserByApi(token, adminUser.id);
  await deleteUserByApi(token, doctorUser.id);
  await deleteUserByApi(token, patientUser.id);
});

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
});

test.describe("Login with each user type", () => {
  test("Verify login successfully with admin user", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.enterCredential(
      adminUser.email,
      process.env.CREATE_DATA_PASSWORD!
    );

    const userVuexPage = new UserVuexPage(page);
    await userVuexPage.waitForLoad();
  });

  test("Verify login successfully with doctor user", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.enterCredential(
      doctorUser.email,
      process.env.CREATE_DATA_PASSWORD!
    );

    const manageSchedulePage = new ManageSchedulePage(page);
    await manageSchedulePage.waitForLoad();
  });

  test("Verify failt to login with patient user", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.enterCredential(
      patientUser.email,
      process.env.CREATE_DATA_PASSWORD!
    );

    await expect(loginPage.errorMessage).toHaveText(
      "This email can't login to the system"
    );
  });
});

test("Redirect to login page when not logged in", async ({ page }) => {
  const userVuexPage = new UserVuexPage(page);
  await userVuexPage.goto();
  expect(page.url()).toContain(`/login?redirect=${userVuexPage.pageUrl}`);

  const loginPage = new LoginPage(page);
  await loginPage.enterCredential(
    adminUser.email,
    process.env.CREATE_DATA_PASSWORD!
  );
  await userVuexPage.waitForLoad();
});

test("Verify stay logged in after login", async ({ page, context }) => {
  const loginPage = new LoginPage(page);
  await loginPage.enterCredential(
    adminUser.email,
    process.env.CREATE_DATA_PASSWORD!
  );

  const userVuexPage = new UserVuexPage(page);
  await userVuexPage.waitForLoad();

  await page.close();
  const newPage = await context.newPage();
  await newPage.goto(userVuexPage.pageUrl);
  await expect(newPage).toHaveTitle("User Vuex");
});

test("Should have welcome text in the navigation bar", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.enterCredential(
    adminUser.email,
    process.env.CREATE_DATA_PASSWORD!
  );

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

//Login fail
testLoginData.forEach((data) => {
  test(`Verify login fail with email: "${data.email}" and password: "${data.password}"`, async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.enterCredential(data.email, data.password);
    await expect(loginPage.errorMessage).toHaveText(data.message);
  });
});
