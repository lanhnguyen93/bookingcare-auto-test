import { expect, test } from "../../../../fixtures/auth-test";
import { UserVuexPage } from "../../../../pages/system/userVuexPage";
import { verifyAlertMessage } from "../../../../utils/pageHelper";
import {
  emptyUserData,
  randomUserData,
  testCreateUserData,
} from "../../../testData/userData";

test("Should add a new user successfully", async ({ page }) => {
  // Go to the CRUD Vuex page
  const userVuexPage = new UserVuexPage(page);
  await userVuexPage.goto();
  await userVuexPage.waitForLoad();

  // Verify clear form at initial state
  await userVuexPage.verifyInputForm(emptyUserData, false);

  // Add a new user
  const userData = randomUserData();
  await userVuexPage.inputFormAddUser(userData);
  await userVuexPage.submitButton.click();

  // Verify the success message
  // await verifyAlertMessage(page, "Add a new user is success!");
  await userVuexPage.verifyAlertMessage("Add a new user is success!");

  // //Verify the user is added into the user list
  expect(page.locator("table tbody tr", { hasText: userData.email }))
    .toBeVisible;

  //Verify clear form after adding user successfully
  await userVuexPage.verifyInputForm(emptyUserData, false);

  //Teardown - delete user
  await page
    .locator("table tbody tr", { hasText: userData.email })
    .locator(".delete-icon")
    .click();
});

testCreateUserData.forEach(({ user, message, titleTestcase }) => {
  test(`Should create user ${titleTestcase}`, async ({ page }) => {
    // Go to the CRUD Vuex page
    const userVuexPage = new UserVuexPage(page);
    await userVuexPage.goto();
    await userVuexPage.waitForLoad();

    // Add invalid user data
    await userVuexPage.inputFormAddUser(user);
    await userVuexPage.submitButton.click();

    // Verify alert message
    // await verifyAlertMessage(page, message);
    await userVuexPage.verifyAlertMessage(message);

    // // Verify the form input is not cleared
    await userVuexPage.verifyInputForm(user, false);
  });
});
