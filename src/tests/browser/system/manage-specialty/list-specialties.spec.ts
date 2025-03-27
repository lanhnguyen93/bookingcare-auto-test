import { test } from "../../../../fixtures/auth-test";
import { ManageSpecialtyPage } from "../../../../pages/system/manageSpecialtyPage";
import { getAllSpecialtiesByApi } from "../../../../utils/doctorHelper";

test("should display the list of specialty correctly", async ({ page }) => {
  const specialties = await getAllSpecialtiesByApi();
  // Go to the CRUD Vuex page
  const manageSpecialtyPage = new ManageSpecialtyPage(page);
  await manageSpecialtyPage.goto();
  await manageSpecialtyPage.waitForLoad();

  await manageSpecialtyPage.specialtyCombobox.click();
  await manageSpecialtyPage.verifyContentInList(specialties);
});
