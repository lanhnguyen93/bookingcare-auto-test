import { test } from "../../../../fixtures/auth-test";
import { ManageClinicPage } from "../../../../pages/system/manageClinicPage";
import { getAllClinicsByApi } from "../../../../utils/doctorHelper";
import { emptyClinicData } from "../../../testData/clinicData";

test("should display the list of specialty correctly", async ({ page }) => {
  const clinics = await getAllClinicsByApi();
  // Go to the Magage Clinic Page
  const manageClinicPage = new ManageClinicPage(page);
  await manageClinicPage.goto();
  await manageClinicPage.waitForLoad();

  await manageClinicPage.clinicCombobox.click();
  await manageClinicPage.verifyContentInList(clinics);
});

test("should the form be filled when selecting a clinic", async ({ page }) => {
  const clinics = await getAllClinicsByApi();
  // Go to the Magage Clinic Page
  const manageClinicPage = new ManageClinicPage(page);
  await manageClinicPage.goto();
  await manageClinicPage.waitForLoad();

  // Verify initial state
  await manageClinicPage.verifyForm(emptyClinicData, false);

  // Choose a clinic and verify input form
  await manageClinicPage.clinicCombobox.click();
  await manageClinicPage.clinicItems.first().click();
  await manageClinicPage.verifyForm(clinics[0], true);
  await manageClinicPage.clinicCombobox.click();
  await manageClinicPage.clinicItems.nth(1).click();
  await manageClinicPage.verifyForm(clinics[1], true);
  await manageClinicPage.clearButton.click();
  await manageClinicPage.verifyForm(emptyClinicData, false);
});
