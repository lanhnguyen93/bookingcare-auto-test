import { expect, test } from "../../../../fixtures/auth-test";
import { ManageClinicPage } from "../../../../pages/system/manageClinicPage";
import { getToken } from "../../../../utils/commonUtils";
import {
  createClinicByApi,
  deleteClinicByApi,
} from "../../../../utils/doctorHelper";
import {
  emptyClinicData,
  randomClinicData,
} from "../../../testData/clinicData";

test("Should edit clinic successfully", async ({ page }) => {
  // Create a new clinic
  const clinic = await createClinicByApi(getToken());

  // Go to the Magage Clinic Page
  const manageClinicPage = new ManageClinicPage(page);
  await manageClinicPage.goto();
  await manageClinicPage.waitForLoad();

  // Select the clinic
  await manageClinicPage.clinicCombobox.click();
  const clinicItem = page
    .locator("li[role=option]")
    .getByText(clinic.name, { exact: true });
  await clinicItem.click();

  // Edit the user infor
  const clinicData = await randomClinicData();
  await manageClinicPage.fillForm(clinicData, true);
  await manageClinicPage.submitButton.click();

  // Verify the success message
  await manageClinicPage.verifyAlertMessage("Edit clinic is success");

  //Verify clear form after edit clinic successfully
  await manageClinicPage.clinicName.click();
  await manageClinicPage.verifyForm(emptyClinicData, false);

  //Verify the clinic is added into the clinic list
  await manageClinicPage.clinicCombobox.click();
  await expect(
    page.locator("li[role=option]").getByText(clinicData.name, { exact: true })
  ).toBeVisible;

  // Teardown - delete specilaty;
  await deleteClinicByApi(getToken(), clinic.id);
});

test("Should fail to edit clinic without name", async ({ page }) => {
  // Create a new clinic
  const clinic = await createClinicByApi(getToken());

  // Go to the Magage Clinic Page
  const manageClinicPage = new ManageClinicPage(page);
  await manageClinicPage.goto();
  await manageClinicPage.waitForLoad();

  // Select the clinic
  await manageClinicPage.clinicCombobox.click();
  const clinicItem = page
    .locator("li[role=option]")
    .getByText(clinic.name, { exact: true });
  await clinicItem.click();

  // Edit the user infor
  await manageClinicPage.clinicName.clear();
  await manageClinicPage.submitButton.click();

  // Verify the success message
  await manageClinicPage.verifyAlertMessage(
    "Missing require parameter: name, address, id"
  );
  await manageClinicPage.clinicName.click();

  // Teardown - delete clinic;
  await deleteClinicByApi(getToken(), clinic.id);
});

test("Should fail to edit clinic without address", async ({ page }) => {
  // Create a new clinic
  const clinic = await createClinicByApi(getToken());

  // Go to the Magage Clinic Page
  const manageClinicPage = new ManageClinicPage(page);
  await manageClinicPage.goto();
  await manageClinicPage.waitForLoad();

  // Select the clinic
  await manageClinicPage.clinicCombobox.click();
  const clinicItem = page
    .locator("li[role=option]")
    .getByText(clinic.name, { exact: true });
  await clinicItem.click();

  // Edit the user infor
  await manageClinicPage.clinicAddress.clear();
  await manageClinicPage.submitButton.click();

  // Verify the success message
  await manageClinicPage.verifyAlertMessage(
    "Missing require parameter: name, address, id"
  );
  await manageClinicPage.clinicName.click();

  // Teardown - delete specilaty;
  await deleteClinicByApi(getToken(), clinic.id);
});

test("Should fail to edit clinic with non-exist clinic", async ({ page }) => {
  // Create a new clinic
  const clinic = await createClinicByApi(getToken());

  // Go to the Magage Clinic Page
  const manageClinicPage = new ManageClinicPage(page);
  await manageClinicPage.goto();
  await manageClinicPage.waitForLoad();

  // Select the clinic
  await manageClinicPage.clinicCombobox.click();
  const clinicItem = page
    .locator("li[role=option]")
    .getByText(clinic.name, { exact: true });
  await clinicItem.click();

  // Delete the clinic
  await deleteClinicByApi(getToken(), clinic.id);

  // Edit the clinic infor
  await manageClinicPage.submitButton.click();

  // Verify the success message
  await manageClinicPage.verifyAlertMessage("The clinic is not exist!");

  //Verify the form is not clear
  await manageClinicPage.verifyForm(clinic, true);

  //Verify the clinic is delete form the clinic list
  await manageClinicPage.clinicCombobox.click();
  await expect(
    page.locator("li[role=option]").getByText(clinic.name, { exact: true })
  ).toBeHidden;
});
