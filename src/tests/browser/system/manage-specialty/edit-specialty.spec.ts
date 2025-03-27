import { expect, test } from "../../../../fixtures/auth-test";
import { SpecialtyPage } from "../../../../pages/system/specialtyPage";
import { getToken } from "../../../../utils/commonUtils";
import {
  createSpecialtyByApi,
  deleteSpecialtyByApi,
  deleteSpecialtyByName,
  getAllSpecialtiesByApi,
} from "../../../../utils/doctorHelper";
import { verifyAlertMessage } from "../../../../utils/pageHelper";
import {
  emptySpecialData,
  randomSpecialtyData,
} from "../../../testData/specialtyData";

test("Should edit specialty successfully", async ({ page }) => {
  // Create a new specialty
  const specialty = await createSpecialtyByApi(getToken());

  // Go to the CRUD Vuex page
  const specialtyPage = new SpecialtyPage(page);
  await specialtyPage.goto();
  await specialtyPage.waitForLoad();

  // Select the specialty
  await specialtyPage.specialtyCombobox.click();
  const specialtyItem = page
    .locator("li[role=option]")
    .getByText(specialty.name, { exact: true });
  await specialtyItem.click();

  // Verify input form
  await specialtyPage.verifyEditForm(specialty);

  // Edit the user infor
  const specialtyData = randomSpecialtyData();
  await specialtyPage.fillForm(specialtyData, true);
  await specialtyPage.submitButton.click();

  // Verify the success message
  await specialtyPage.verifyAlertMessage("Edit specialty is success");

  //Verify clear form after edit specialty successfully
  await specialtyPage.specialtyName.click();
  await specialtyPage.verifyAddnewForm(emptySpecialData);

  //Verify the specialty is added into the specialty list
  await specialtyPage.specialtyCombobox.click();
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
  const specialtyPage = new SpecialtyPage(page);
  await specialtyPage.goto();
  await specialtyPage.waitForLoad();

  // Select the specialty
  await specialtyPage.specialtyCombobox.click();
  const specialtyItem = page
    .locator("li[role=option]")
    .getByText(specialty.name, { exact: true });
  await specialtyItem.click();

  // Edit the user infor
  await specialtyPage.specialtyName.clear();
  await specialtyPage.submitButton.click();

  // Verify the success message
  await specialtyPage.verifyAlertMessage("Missing require parameter: name, id");

  // Teardown - delete specilaty;
  await deleteSpecialtyByApi(getToken(), specialty.id);
});

test("Should fail to edit specialty with non-exist user", async ({ page }) => {
  // Create a new specialty
  const specialty = await createSpecialtyByApi(getToken());

  // Go to the CRUD Vuex page
  const specialtyPage = new SpecialtyPage(page);
  await specialtyPage.goto();
  await specialtyPage.waitForLoad();

  // Select the specialty
  await specialtyPage.specialtyCombobox.click();
  const specialtyItem = page
    .locator("li[role=option]")
    .getByText(specialty.name, { exact: true });
  await specialtyItem.click();

  // Delete the specialty
  await deleteSpecialtyByApi(getToken(), specialty.id);

  // Edit the specialty infor
  await specialtyPage.submitButton.click();

  // Verify the success message
  await specialtyPage.verifyAlertMessage("The specialty is not exist!");

  //Verify the form is not clear
  await specialtyPage.verifyEditForm(specialty);

  //Verify the specialty is delete form the specialty list
  await specialtyPage.specialtyCombobox.click();
  await expect(
    page.locator("li[role=option]").getByText(specialty.name, { exact: true })
  ).toBeHidden;
});
