import { expect, test } from "../../../../fixtures/auth-test";
import { UserVuexPage } from "../../../../pages/system/userVuexPage";
import { getToken } from "../../../../utils/commonUtils";
import { verifyAlertMessage } from "../../../../utils/pageHelper";
import { deleteUserByApi } from "../../../../utils/userHelper";

test("should delete user successfully", async ({ page, createAdmin }) => {
  // Create a new user
  const user = createAdmin;

  // Go to the CRUD Vuex page
  const userVuexPage = new UserVuexPage(page);
  await userVuexPage.goto();
  await userVuexPage.waitForLoad();

  // Delete user
  const index = await userVuexPage.findIndexRow(user.email);
  await userVuexPage.clickDeleteIcon(index!);

  // Verify the successfully message
  // await verifyAlertMessage(page, "The user is deleted!");
  await userVuexPage.verifyAlertMessage("The user is deleted!");

  // Verify user not in the table
  await userVuexPage.goto();
  await userVuexPage.waitForLoad();
  expect(page.locator("table tbody tr", { hasText: user.email })).toBeHidden;
});

test("should fail to delete non-exist user", async ({ page, createAdmin }) => {
  // Create a new user
  const user = createAdmin;

  // Go to the CRUD Vuex page
  const userVuexPage = new UserVuexPage(page);
  await userVuexPage.goto();
  await userVuexPage.waitForLoad();

  // Delte user by API
  await deleteUserByApi(getToken(), user.id);

  // Delete user
  const index = await userVuexPage.findIndexRow(user.email);
  await userVuexPage.clickDeleteIcon(index!);

  // Verify the successfully message
  // await verifyAlertMessage(page, "The user is not exist!");
  await userVuexPage.verifyAlertMessage("The user is not exist!");

  // Verify user not in the table
  await userVuexPage.goto();
  await userVuexPage.waitForLoad();
  expect(page.locator("table tbody tr", { hasText: user.email })).toBeHidden;
});
