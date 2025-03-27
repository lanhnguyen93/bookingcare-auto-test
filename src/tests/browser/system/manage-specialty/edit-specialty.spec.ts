import { expect, test } from "../../../../fixtures/auth-test";
import { ManageSpecialtyPage } from "../../../../pages/system/manageSpecialtyPage";
import { getToken } from "../../../../utils/commonUtils";
import {
  createSpecialtyByApi,
  deleteSpecialtyByApi,
} from "../../../../utils/doctorHelper";
import {
  emptySpecialData,
  randomSpecialtyData,
} from "../../../testData/specialtyData";

test("Should edit specialty successfully", async ({ page }) => {
  // Create a new specialty
  const specialty = await createSpecialtyByApi(getToken());

  // Go to the CRUD Vuex page
  const manageSpecialtyPage = new ManageSpecialtyPage(page);
  await manageSpecialtyPage.goto();
  await manageSpecialtyPage.waitForLoad();

  // Select the specialty
  await manageSpecialtyPage.specialtyCombobox.click();
  const specialtyItem = page
    .locator("li[role=option]")
    .getByText(specialty.name, { exact: true });
  await specialtyItem.click();

  // Verify input form
  await manageSpecialtyPage.verifyEditForm(specialty);

  // Edit the user infor
  const specialtyData = randomSpecialtyData();
  await manageSpecialtyPage.fillForm(specialtyData, true);
  await manageSpecialtyPage.submitButton.click();

  // Verify the success message
  await manageSpecialtyPage.verifyAlertMessage("Edit specialty is success");

  //Verify clear form after edit specialty successfully
  await manageSpecialtyPage.specialtyName.click();
  await manageSpecialtyPage.verifyAddnewForm(emptySpecialData);

  //Verify the specialty is added into the specialty list
  await manageSpecialtyPage.specialtyCombobox.click();
  await expect(
    page
      .locator("li[role=option]")
      .getByText(specialtyData.name, { exact: true })
  ).toBeVisible;

  // Teardown - delete specilaty;
  await deleteSpecialtyByApi(getToken(), specialty.id);
});

test("Should fail to edit specialty without name", async ({ page }) => {
  // Create a new specialty
  const specialty = await createSpecialtyByApi(getToken());

  // Go to the CRUD Vuex page
  const manageSpecialtyPage = new ManageSpecialtyPage(page);
  await manageSpecialtyPage.goto();
  await manageSpecialtyPage.waitForLoad();

  // Select the specialty
  await manageSpecialtyPage.specialtyCombobox.click();
  const specialtyItem = page
    .locator("li[role=option]")
    .getByText(specialty.name, { exact: true });
  await specialtyItem.click();

  // Edit the user infor
  await manageSpecialtyPage.specialtyName.clear();
  await manageSpecialtyPage.submitButton.click();

  // Verify the success message
  await manageSpecialtyPage.verifyAlertMessage(
    "Missing require parameter: name, id"
  );

  // Teardown - delete specilaty;
  await deleteSpecialtyByApi(getToken(), specialty.id);
});

test("Should fail to edit specialty with non-exist user", async ({ page }) => {
  // Create a new specialty
  const specialty = await createSpecialtyByApi(getToken());

  // Go to the CRUD Vuex page
  const manageSpecialtyPage = new ManageSpecialtyPage(page);
  await manageSpecialtyPage.goto();
  await manageSpecialtyPage.waitForLoad();

  // Select the specialty
  await manageSpecialtyPage.specialtyCombobox.click();
  const specialtyItem = page
    .locator("li[role=option]")
    .getByText(specialty.name, { exact: true });
  await specialtyItem.click();

  // Delete the specialty
  await deleteSpecialtyByApi(getToken(), specialty.id);

  // Edit the specialty infor
  await manageSpecialtyPage.submitButton.click();

  // Verify the success message
  await manageSpecialtyPage.verifyAlertMessage("The specialty is not exist!");

  //Verify the form is not clear
  await manageSpecialtyPage.verifyEditForm(specialty);

  //Verify the specialty is delete form the specialty list
  await manageSpecialtyPage.specialtyCombobox.click();
  await expect(
    page.locator("li[role=option]").getByText(specialty.name, { exact: true })
  ).toBeHidden;
});
