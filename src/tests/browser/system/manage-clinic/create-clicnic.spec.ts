import { expect, test } from "../../../../fixtures/auth-test";
import { ManageClinicPage } from "../../../../pages/system/manageClinicPage";
import { getToken } from "../../../../utils/commonUtils";
import {
  deleteClinicByName,
  getAllClinicsByApi,
} from "../../../../utils/doctorHelper";
import { verifyAlertMessage } from "../../../../utils/pageHelper";
import {
  emptyClinicData,
  randomClinicData,
} from "../../../testData/clinicData";

test("Should create a new clinic successful", async ({ page }) => {
  // Go to the Magage Clinic Page
  const manageClinicPage = new ManageClinicPage(page);
  await manageClinicPage.goto();
  await manageClinicPage.waitForLoad();

  // Add new clinic
  const clinicData = await randomClinicData();
  await manageClinicPage.fillForm(clinicData, false);
  await manageClinicPage.submitButton.click();

  // Verify the success message
  await manageClinicPage.verifyAlertMessage("Add clinic is success!");

  //Verify clear form after adding clinic successfully
  await manageClinicPage.clinicName.click();
  await manageClinicPage.verifyForm(emptyClinicData, false);

  //Verify the clinic is added into the clinic list
  await manageClinicPage.clinicCombobox.click();
  const clinicItem = page
    .locator("li[role=option]")
    .getByText(clinicData.name, { exact: true });
  await expect(clinicItem).toBeVisible;

  // Teardown - delete clinic;
  await deleteClinicByName(getToken(), clinicData.name);
});

test("Should fail to create without name", async ({ page }) => {
  // Go to the Magage Clinic Page
  const manageClinicPage = new ManageClinicPage(page);
  await manageClinicPage.goto();
  await manageClinicPage.waitForLoad();

  // Add new clinic
  const clinicData = await randomClinicData();
  clinicData.name = "";
  await manageClinicPage.fillForm(clinicData, false);
  await manageClinicPage.submitButton.click();

  // Verify the success message
  await verifyAlertMessage(page, "Missing required paramters: name or address");

  //Verify the form not clear
  await manageClinicPage.clinicName.click();
  await manageClinicPage.verifyForm(clinicData, false);
});

test("Should fail to create without address", async ({ page }) => {
  // Go to the Magage Clinic Page
  const manageClinicPage = new ManageClinicPage(page);
  await manageClinicPage.goto();
  await manageClinicPage.waitForLoad();

  // Add new clinic
  const clinicData = await randomClinicData();
  clinicData.address = "";
  await manageClinicPage.fillForm(clinicData, false);
  await manageClinicPage.submitButton.click();

  // Verify the success message
  await verifyAlertMessage(page, "Missing required paramters: name or address");

  //Verify the form not clear
  await manageClinicPage.clinicName.click();
  await manageClinicPage.verifyForm(clinicData, false);
});

test("Should fail to create with exist name", async ({ page }) => {
  const clinics = await getAllClinicsByApi();
  const clinicName = clinics[0].name;
  // Go to the Magage Clinic Page
  const manageClinicPage = new ManageClinicPage(page);
  await manageClinicPage.goto();
  await manageClinicPage.waitForLoad();

  // Add new clinic with exist name
  await manageClinicPage.clinicName.fill(clinicName);
  await manageClinicPage.clinicAddress.fill("something fake data");
  await manageClinicPage.submitButton.click();

  // Verify the success message
  await verifyAlertMessage(page, "The clinic already exists!");
});
