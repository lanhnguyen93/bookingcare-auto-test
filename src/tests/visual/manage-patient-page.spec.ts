import { expect, test } from "../../fixtures/auth-test";
import { ManagePatientPage } from "../../pages/system/managePatientPage";

test("should display layout correctly", async ({ page }) => {
  const managePatientPage = new ManagePatientPage(page);
  await managePatientPage.goto();
  await managePatientPage.waitForLoad();

  //initial state
  await expect(managePatientPage.patientFrame).toHaveScreenshot(
    "initial-patient-page.png"
  );

  //manage booking table
  await managePatientPage.doctorCombobox.click();
  await managePatientPage.doctorItems.first().click();
  await managePatientPage.calendar.fill("2025-02-24");
  await expect(managePatientPage.patientFrame).toHaveScreenshot(
    "manage-booking-table.png"
  );
});
