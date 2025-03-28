import { expect, test } from "../../../../fixtures/auth-test";
import { ManageDoctorInforPage } from "../../../../pages/system/manageDoctorInforPage";
import { getToken } from "../../../../utils/commonUtils";
import { deleteDoctorInforByApi } from "../../../../utils/doctorHelper";
import { createUserByApi, deleteUserByApi } from "../../../../utils/userHelper";
import { randomDoctorInforData } from "../../../testData/doctorInforData";

test("should create doctor infor successfully", async ({ page }) => {
  // Create a new user with role = doctor
  const doctor = await createUserByApi(getToken(), "Doctor");
  const doctorInforData = await randomDoctorInforData(doctor.id);

  // Go to the Magage Doctor Infor Page
  const manageDoctorInforPage = new ManageDoctorInforPage(page);
  await manageDoctorInforPage.goto();
  await manageDoctorInforPage.waitForLoad();

  // Choose the doctor from doctor list
  await manageDoctorInforPage.doctorCombobox.click();
  await manageDoctorInforPage.selectDoctorByDoctorId(doctor.id);

  // Create doctor infor
  await manageDoctorInforPage.fillForm(doctorInforData);
  await manageDoctorInforPage.saveButton.click();

  // Verify the success message
  await manageDoctorInforPage.verifyAlertMessage("Add doctor info is success!");

  //Verify clear form after adding clinic successfully
  await manageDoctorInforPage.description.click();
  await expect(await manageDoctorInforPage.isEmptyForm()).toBeTruthy();

  //Verify the doctor infor is added
  await manageDoctorInforPage.selectDoctorByDoctorId(doctor.id);
  await manageDoctorInforPage.verifyFormByDoctorId(doctor.id);

  // Teardown - delete clinic;
  await deleteUserByApi(getToken(), doctor.id);
  await deleteDoctorInforByApi(getToken(), doctor.id);
});

test("should failt to create doctor without doctorId", async ({ page }) => {
  // Create a new user with role = doctor
  const doctor = await createUserByApi(getToken(), "Doctor");
  const doctorInforData = await randomDoctorInforData(doctor.id);

  // Go to the Magage Doctor Infor Page
  const manageDoctorInforPage = new ManageDoctorInforPage(page);
  await manageDoctorInforPage.goto();
  await manageDoctorInforPage.waitForLoad();

  // Choose the doctor from doctor list
  await manageDoctorInforPage.doctorCombobox.click();
  await manageDoctorInforPage.selectDoctorByDoctorId(doctor.id);

  // Create doctor infor
  await manageDoctorInforPage.fillForm(doctorInforData);
  await manageDoctorInforPage.doctorClearButton.click();
  await manageDoctorInforPage.saveButton.click();

  // Verify the success message
  await manageDoctorInforPage.verifyAlertMessage(
    "Missing required paramters: doctorId or description or content"
  );

  // Verify the form be clear
  await manageDoctorInforPage.description.click();
  await expect(await manageDoctorInforPage.isEmptyForm()).toBeTruthy();

  // Teardown - delete clinic;
  await deleteUserByApi(getToken(), doctor.id);
});

test("should failt to create doctor without description", async ({ page }) => {
  // Create a new user with role = doctor
  const doctor = await createUserByApi(getToken(), "Doctor");
  const doctorInforData = await randomDoctorInforData(doctor.id);

  // Go to the Magage Doctor Infor Page
  const manageDoctorInforPage = new ManageDoctorInforPage(page);
  await manageDoctorInforPage.goto();
  await manageDoctorInforPage.waitForLoad();

  // Choose the doctor from doctor list
  await manageDoctorInforPage.doctorCombobox.click();
  await manageDoctorInforPage.selectDoctorByDoctorId(doctor.id);

  // Create doctor infor
  await manageDoctorInforPage.fillForm(doctorInforData);
  await manageDoctorInforPage.description.clear();
  await manageDoctorInforPage.saveButton.click();

  // Verify the success message
  await manageDoctorInforPage.verifyAlertMessage(
    "Missing required paramters: doctorId or description or content"
  );

  //   Verify the form not clear
  await manageDoctorInforPage.description.click();
  await expect(await manageDoctorInforPage.isEmptyForm()).toBeFalsy();

  // Teardown - delete clinic;
  await deleteUserByApi(getToken(), doctor.id);
});

test("should failt to create doctor without content", async ({ page }) => {
  // Create a new user with role = doctor
  const doctor = await createUserByApi(getToken(), "Doctor");
  const doctorInforData = await randomDoctorInforData(doctor.id);

  // Go to the Magage Doctor Infor Page
  const manageDoctorInforPage = new ManageDoctorInforPage(page);
  await manageDoctorInforPage.goto();
  await manageDoctorInforPage.waitForLoad();

  // Choose the doctor from doctor list
  await manageDoctorInforPage.doctorCombobox.click();
  await manageDoctorInforPage.selectDoctorByDoctorId(doctor.id);

  // Create doctor infor
  doctorInforData.contentMarkdown = "";
  await manageDoctorInforPage.fillForm(doctorInforData);
  await manageDoctorInforPage.saveButton.click();

  // Verify the success message
  await manageDoctorInforPage.verifyAlertMessage(
    "Missing required paramters: doctorId or description or content"
  );

  //   Verify the form not clear
  await manageDoctorInforPage.description.click();
  await expect(await manageDoctorInforPage.isEmptyForm()).toBeFalsy();

  // Teardown - delete clinic;
  await deleteUserByApi(getToken(), doctor.id);
});
