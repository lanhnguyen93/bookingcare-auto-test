import { test } from "../../../../fixtures/auth-test";
import { SpecialtyPage } from "../../../../pages/system/specialtyPage";
import { getAllSpecialtiesByApi } from "../../../../utils/doctorHelper";

test("should display the list of specialty correctly", async ({ page }) => {
  const specialties = await getAllSpecialtiesByApi();
  // Go to the CRUD Vuex page
  const specialtyPage = new SpecialtyPage(page);
  await specialtyPage.goto();
  await specialtyPage.waitForLoad();

  await specialtyPage.specialtyCombobox.click();
  await specialtyPage.verifyContentInList(specialties);
});
