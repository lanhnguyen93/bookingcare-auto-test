import { expect, test } from "../../../../fixtures/auth-test";
import { ManageClinicPage } from "../../../../pages/system/manageClinicPage";
import { getToken } from "../../../../utils/commonUtils";
import {
  createClinicByApi,
  deleteClinicByApi,
} from "../../../../utils/doctorHelper";

test("should delete clinic successfully", async ({ page }) => {
  // Create a new clinic
  const clinic = await createClinicByApi(getToken());

  // Go to the Magage Clinic Page
  const manageClinicPage = new ManageClinicPage(page);
  await manageClinicPage.goto();
  await manageClinicPage.waitForLoad();

  // Delete clinic
  await manageClinicPage.clinicCombobox.click();
  const clinicItem = page
    .locator("li[role=option]")
    .getByText(clinic.name, { exact: true });
  await clinicItem.click();
  await manageClinicPage.deleteButton.click();

  // Verify the successfully message
  await manageClinicPage.verifyAlertMessage("Delete the clinic successfully");

  //Verify the clinic is deleted from the clinic list
  await manageClinicPage.clinicCombobox.click();
  await expect(clinicItem).toBeHidden;
});

test("should fail to delete non-exist clinic", async ({ page }) => {
  // Create a new clinic
  const clinic = await createClinicByApi(getToken());

  // Go to the Magage Clinic Page
  const manageClinicPage = new ManageClinicPage(page);
  await manageClinicPage.goto();
  await manageClinicPage.waitForLoad();

  // Select clinic
  await manageClinicPage.clinicCombobox.click();
  const clinicItem = page
    .locator("li[role=option]")
    .getByText(clinic.name, { exact: true });
  await clinicItem.click();

  // Delte clinic by API
  await deleteClinicByApi(getToken(), clinic.id);

  // Verify error message
  await manageClinicPage.deleteButton.click();
  await manageClinicPage.verifyAlertMessage("The clinic is not exist!");

  // Verify clinic not in the list
  await manageClinicPage.clinicCombobox.click();
  await expect(clinicItem).toBeHidden;
});
