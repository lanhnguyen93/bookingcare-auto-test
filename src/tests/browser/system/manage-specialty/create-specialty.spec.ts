import { expect, test } from "../../../../fixtures/auth-test";
import { ManageSpecialtyPage } from "../../../../pages/system/manageSpecialtyPage";
import { getToken } from "../../../../utils/commonUtils";
import {
  deleteSpecialtyByName,
  getAllSpecialtiesByApi,
} from "../../../../utils/doctorHelper";
import { verifyAlertMessage } from "../../../../utils/pageHelper";
import {
  emptySpecialData,
  randomSpecialtyData,
} from "../../../testData/specialtyData";

test("Should create a new specialty successful", async ({ page }) => {
  // Go to the CRUD Vuex page
  const manageSpecialtyPage = new ManageSpecialtyPage(page);
  await manageSpecialtyPage.goto();
  await manageSpecialtyPage.waitForLoad();

  // Verify initial state
  await manageSpecialtyPage.verifyAddnewForm(emptySpecialData);

  // Add new specialty
  const specialtyData = randomSpecialtyData();
  await manageSpecialtyPage.fillForm(specialtyData, false);
  await manageSpecialtyPage.submitButton.click();

  // Verify the success message
  await manageSpecialtyPage.verifyAlertMessage("Add specialty is success!");

  //Verify clear form after adding specialty successfully
  await manageSpecialtyPage.specialtyName.click();
  await manageSpecialtyPage.verifyAddnewForm(emptySpecialData);

  //Verify the specialty is added into the specialty list
  await manageSpecialtyPage.specialtyCombobox.click();
  const specialtyItem = page
    .locator("li[role=option]")
    .getByText(specialtyData.name, { exact: true });
  await expect(specialtyItem).toBeVisible;

  // Teardown - delete specilaty;
  await deleteSpecialtyByName(getToken(), specialtyData.name);
});

test("Should fail to create without name", async ({ page }) => {
  // Go to the CRUD Vuex page
  const manageSpecialtyPage = new ManageSpecialtyPage(page);
  await manageSpecialtyPage.goto();
  await manageSpecialtyPage.waitForLoad();

  // Verify initial state
  await manageSpecialtyPage.verifyAddnewForm(emptySpecialData);

  // Add new specialty
  const specialtyData = randomSpecialtyData();
  specialtyData.name = "";
  await manageSpecialtyPage.fillForm(specialtyData, false);
  await manageSpecialtyPage.submitButton.click();

  // Verify the success message
  await verifyAlertMessage(page, "Missing required paramters: name");

  //Verify the form not clear
  await manageSpecialtyPage.specialtyName.click();
  await manageSpecialtyPage.verifyAddnewForm(specialtyData);
});

test("Should fail to create with exist name", async ({ page }) => {
  const specialtys = await getAllSpecialtiesByApi();
  const specialtyName = specialtys[0].name;
  // Go to the CRUD Vuex page
  const manageSpecialtyPage = new ManageSpecialtyPage(page);
  await manageSpecialtyPage.goto();
  await manageSpecialtyPage.waitForLoad();

  // Add new specialty with exist name
  await manageSpecialtyPage.specialtyName.fill(specialtyName);
  await manageSpecialtyPage.submitButton.click();

  // Verify the success message
  await verifyAlertMessage(page, "The specialty already exists!");

  //Verify the form not clear
  await manageSpecialtyPage.specialtyName.click();
  await expect(await manageSpecialtyPage.specialtyName.inputValue()).toBe(
    specialtyName
  );
});
