import { expect, test } from "../../../../fixtures/auth-test";
import { ManageSchedulePage } from "../../../../pages/system/manageSchedulePage";
import { getToken } from "../../../../utils/commonUtils";
import { deleteScheduleByApi } from "../../../../utils/doctorHelper";
import { createUserByApi, deleteUserByApi } from "../../../../utils/userHelper";
import { randomSchedulesData } from "../../../testData/schedulesData";

test("should bulk create schedules successfully", async ({ page }) => {
  const doctor = await createUserByApi(getToken(), "Doctor");
  const schedulesData = await randomSchedulesData(doctor.id);

  // Go to the Magage Schedule Page
  const manageSchedulePage = new ManageSchedulePage(page);
  await manageSchedulePage.goto();
  await manageSchedulePage.waitForLoad();

  // Bulk create schedules
  await manageSchedulePage.fillForm(schedulesData);
  await manageSchedulePage.saveButton.click();

  // Verify the success message
  await manageSchedulePage.verifyAlertMessage("Add new schedules successfully");

  //Verify clear form after adding schedules successfully
  await manageSchedulePage.pageTitle.click();
  await expect(await manageSchedulePage.isEmptyForm()).toBeTruthy();

  // Teardown - delete doctor, schedules;
  await deleteUserByApi(getToken(), doctor.id);
  await deleteScheduleByApi(getToken(), doctor.id, schedulesData[0].date);
});

test("should fail to bulk create without doctor", async ({ page }) => {
  const doctor = await createUserByApi(getToken(), "Doctor");
  const schedulesData = await randomSchedulesData(doctor.id);

  // Go to the Magage Schedule Page
  const manageSchedulePage = new ManageSchedulePage(page);
  await manageSchedulePage.goto();
  await manageSchedulePage.waitForLoad();

  // Bulk create schedules
  await manageSchedulePage.fillForm(schedulesData);
  await manageSchedulePage.doctorClearButton.click();
  await manageSchedulePage.saveButton.click();

  // Verify error message
  await manageSchedulePage.verifyAlertMessage(
    "Please choose a doctor and a date"
  );

  //Verify the form not clear
  await manageSchedulePage.pageTitle.click();
  await expect(await manageSchedulePage.isEmptyForm()).toBeFalsy();

  // Teardown - delete doctor
  await deleteUserByApi(getToken(), doctor.id);
});

test("should fail to bulk create without date", async ({ page }) => {
  const doctor = await createUserByApi(getToken(), "Doctor");
  const schedulesData = await randomSchedulesData(doctor.id);

  // Go to the Magage Schedule Page
  const manageSchedulePage = new ManageSchedulePage(page);
  await manageSchedulePage.goto();
  await manageSchedulePage.waitForLoad();

  // Bulk create schedules
  await manageSchedulePage.fillForm(schedulesData);
  await manageSchedulePage.dateField.clear();
  await manageSchedulePage.saveButton.click();

  // Verify error message
  await manageSchedulePage.verifyAlertMessage(
    "Please choose a doctor and a date"
  );

  //Verify the form not clear
  await manageSchedulePage.pageTitle.click();
  await expect(await manageSchedulePage.isEmptyForm()).toBeFalsy();

  // Teardown - delete doctor
  await deleteUserByApi(getToken(), doctor.id);
});

test("should fail to bulk create without timeblock", async ({ page }) => {
  const doctor = await createUserByApi(getToken(), "Doctor");
  const schedulesData = await randomSchedulesData(doctor.id);

  // Go to the Magage Schedule Page
  const manageSchedulePage = new ManageSchedulePage(page);
  await manageSchedulePage.goto();
  await manageSchedulePage.waitForLoad();

  // Bulk create schedules
  await manageSchedulePage.fillForm(schedulesData);
  await manageSchedulePage.selectTimeBlocks(schedulesData); // un-select timeblocks
  await manageSchedulePage.saveButton.click();

  // Verify error message
  await manageSchedulePage.verifyAlertMessage(
    "Please choose at least a time block"
  );

  //Verify the form not clear
  await manageSchedulePage.pageTitle.click();
  await expect(await manageSchedulePage.isEmptyForm()).toBeFalsy();

  // Teardown - delete doctor
  await deleteUserByApi(getToken(), doctor.id);
});
