import { expect, test } from "../../../../fixtures/auth-test";
import { SpecialtyPage } from "../../../../pages/system/specialtyPage";
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
  const specialtyPage = new SpecialtyPage(page);
  await specialtyPage.goto();
  await specialtyPage.waitForLoad();

  // Verify initial state
  await specialtyPage.verifyAddnewForm(emptySpecialData);

  // Add new specialty
  const specialtyData = randomSpecialtyData();
  await specialtyPage.fillForm(specialtyData, false);
  await specialtyPage.submitButton.click();

  // Verify the success message
  await specialtyPage.verifyAlertMessage("Add specialty is success!");

  //Verify clear form after adding specialty successfully
  await specialtyPage.specialtyName.click();
  await specialtyPage.verifyAddnewForm(emptySpecialData);

  //Verify the specialty is added into the specialty list
  await specialtyPage.specialtyCombobox.click();
  const specialtyItem = page
    .locator("li[role=option]")
    .getByText(specialtyData.name, { exact: true });
  await expect(specialtyItem).toBeVisible;

  // Teardown - delete specilaty;
  await deleteSpecialtyByName(getToken(), specialtyData.name);
});

test("Should fail to create without name", async ({ page }) => {
  // Go to the CRUD Vuex page
  const specialtyPage = new SpecialtyPage(page);
  await specialtyPage.goto();
  await specialtyPage.waitForLoad();

  // Verify initial state
  await specialtyPage.verifyAddnewForm(emptySpecialData);

  // Add new specialty
  const specialtyData = randomSpecialtyData();
  specialtyData.name = "";
  await specialtyPage.fillForm(specialtyData, false);
  await specialtyPage.submitButton.click();

  // Verify the success message
  await verifyAlertMessage(page, "Missing required paramters: name");

  //Verify the form not clear
  await specialtyPage.specialtyName.click();
  await specialtyPage.verifyAddnewForm(specialtyData);
});

test("Should fail to create with exist name", async ({ page }) => {
  const specialtys = await getAllSpecialtiesByApi();
  const specialtyName = specialtys[0].name;
  // Go to the CRUD Vuex page
  const specialtyPage = new SpecialtyPage(page);
  await specialtyPage.goto();
  await specialtyPage.waitForLoad();

  // Add new specialty with exist name
  await specialtyPage.specialtyName.fill(specialtyName);
  await specialtyPage.submitButton.click();

  // Verify the success message
  await verifyAlertMessage(page, "The specialty already exists!");

  //Verify the form not clear
  await specialtyPage.specialtyName.click();
  await expect(await specialtyPage.specialtyName.inputValue()).toBe(
    specialtyName
  );
});
