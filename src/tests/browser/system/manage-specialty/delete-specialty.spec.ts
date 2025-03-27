import { expect, test } from "../../../../fixtures/auth-test";
import { SpecialtyPage } from "../../../../pages/system/specialtyPage";
import { getToken } from "../../../../utils/commonUtils";
import {
  createSpecialtyByApi,
  deleteSpecialtyByApi,
} from "../../../../utils/doctorHelper";

test("should delete specialty successfully", async ({ page }) => {
  // Create a new specialty
  const specialty = await createSpecialtyByApi(getToken());

  // Go to the CRUD Vuex page
  const specialtyPage = new SpecialtyPage(page);
  await specialtyPage.goto();
  await specialtyPage.waitForLoad();

  // Delete specialty
  await specialtyPage.specialtyCombobox.click();
  const specialtyItem = page
    .locator("li[role=option]")
    .getByText(specialty.name, { exact: true });
  await specialtyItem.click();
  await specialtyPage.deleteButton.click();

  // Verify the successfully message
  await specialtyPage.verifyAlertMessage("Delete the specialty successfully");

  //Verify the specialty is deleted from the specialty list
  await specialtyPage.specialtyCombobox.click();
  await expect(specialtyItem).toBeHidden;
});

test("should fail to delete non-exist specialty", async ({ page }) => {
  // Create a new specialty
  const specialty = await createSpecialtyByApi(getToken());

  // Go to the CRUD Vuex page
  const specialtyPage = new SpecialtyPage(page);
  await specialtyPage.goto();
  await specialtyPage.waitForLoad();

  // Select specialty
  await specialtyPage.specialtyCombobox.click();
  const specialtyItem = page
    .locator("li[role=option]")
    .getByText(specialty.name, { exact: true });
  await specialtyItem.click();

  // Delte specialty by API
  await deleteSpecialtyByApi(getToken(), specialty.id);

  // Verify error message
  await specialtyPage.deleteButton.click();
  await specialtyPage.verifyAlertMessage("The specialty is not exist!");

  // Verify specialty not in the list
  await specialtyPage.specialtyCombobox.click();
  await expect(specialtyItem).toBeHidden;
});
