import { expect, test } from "../../../../fixtures/auth-test";
import { UserVuexPage } from "../../../../pages/system/userVuexPage";
import { getToken } from "../../../../utils/commonUtils";
import { verifyAlertMessage } from "../../../../utils/pageHelper";
import { createUserByApi, deleteUserByApi } from "../../../../utils/userHelper";
import { emptyUserData, randomUserData } from "../../../testData/userData";

test("Should edit user successfully", async ({ page }) => {
  // Create a new user
  const token = getToken();
  const user = await createUserByApi(token, "Admin");

  // Go to the CRUD Vuex page
  const userVuexPage = new UserVuexPage(page);
  await userVuexPage.goto();
  await userVuexPage.waitForLoad();

  // Click button Edit user
  const index = await userVuexPage.findIndexRow(user.email);
  await userVuexPage.clickEditIcon(user.email);

  // Verify input form
  await userVuexPage.verifyInputForm(user, true);

  // Edit the user infor
  const userData = randomUserData("Doctor");
  await userVuexPage.inputFormEditUser(userData);
  await userVuexPage.submitButton.click();

  // Verify the success message
  // await verifyAlertMessage(page, "Edit user is success!");
  await userVuexPage.verifyAlertMessage("Edit user is success!");

  //Verify the user is added into the user list
  await expect(page.locator("table tbody tr", { hasText: userData.email }))
    .toBeVisible;

  //Verify clear form after edit user successfully
  await userVuexPage.verifyInputForm(emptyUserData, true);

  //Teardown - delete the user
  await deleteUserByApi(token, user.id);
});

test("Should fail to edit user with non-exist user", async ({ page }) => {
  // Create a new user
  const token = getToken();
  const user = await createUserByApi(token, "Admin");

  // Go to the CRUD Vuex page
  const userVuexPage = new UserVuexPage(page);
  await userVuexPage.goto();
  await userVuexPage.waitForLoad();

  // Click button Edit user
  const index = await userVuexPage.findIndexRow(user.email);
  await userVuexPage.clickEditIcon(user.email);

  // Delete user by API
  await deleteUserByApi(token, user.id);

  // Edit the user infor
  await userVuexPage.submitButton.click();

  // Verify the success message
  // await verifyAlertMessage(page, "The user is not exist!");
  await userVuexPage.verifyAlertMessage("The user is not exist!");

  // // Verify the form input is not cleared
  // await userVuexPage.waitForLoad();
  await userVuexPage.verifyInputForm(user, true);

  //Verify if user exist in the table
  await userVuexPage.goto();
  await userVuexPage.waitForLoad();
  expect(page.locator("table tbody tr", { hasText: user.email })).toBeHidden;
});
