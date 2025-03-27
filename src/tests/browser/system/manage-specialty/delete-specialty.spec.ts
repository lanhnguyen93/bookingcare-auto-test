import { expect, test } from "../../../../fixtures/auth-test";
import { ManageSpecialtyPage } from "../../../../pages/system/manageSpecialtyPage";
import { getToken } from "../../../../utils/commonUtils";
import {
  createSpecialtyByApi,
  deleteSpecialtyByApi,
} from "../../../../utils/doctorHelper";

test("should delete specialty successfully", async ({ page }) => {
  // Create a new specialty
  const specialty = await createSpecialtyByApi(getToken());

  // Go to the CRUD Vuex page
  const manageSpecialtyPage = new ManageSpecialtyPage(page);
  await manageSpecialtyPage.goto();
  await manageSpecialtyPage.waitForLoad();

  // Delete specialty
  await manageSpecialtyPage.specialtyCombobox.click();
  const specialtyItem = page
    .locator("li[role=option]")
    .getByText(specialty.name, { exact: true });
  await specialtyItem.click();
  await manageSpecialtyPage.deleteButton.click();

  // Verify the successfully message
  await manageSpecialtyPage.verifyAlertMessage(
    "Delete the specialty successfully"
  );

  //Verify the specialty is deleted from the specialty list
  await manageSpecialtyPage.specialtyCombobox.click();
  await expect(specialtyItem).toBeHidden;
});

test("should fail to delete non-exist specialty", async ({ page }) => {
  // Create a new specialty
  const specialty = await createSpecialtyByApi(getToken());

  // Go to the CRUD Vuex page
  const manageSpecialtyPage = new ManageSpecialtyPage(page);
  await manageSpecialtyPage.goto();
  await manageSpecialtyPage.waitForLoad();

  // Select specialty
  await manageSpecialtyPage.specialtyCombobox.click();
  const specialtyItem = page
    .locator("li[role=option]")
    .getByText(specialty.name, { exact: true });
  await specialtyItem.click();

  // Delte specialty by API
  await deleteSpecialtyByApi(getToken(), specialty.id);

  // Verify error message
  await manageSpecialtyPage.deleteButton.click();
  await manageSpecialtyPage.verifyAlertMessage("The specialty is not exist!");

  // Verify specialty not in the list
  await manageSpecialtyPage.specialtyCombobox.click();
  await expect(specialtyItem).toBeHidden;
});
