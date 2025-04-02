import { expect, test } from "../../fixtures/auth-test";
import { ManageClinicPage } from "../../pages/system/manageClinicPage";

test("manage clinic page", async ({ page }) => {
  const manageClinicPage = new ManageClinicPage(page);
  await manageClinicPage.goto();
  await manageClinicPage.waitForLoad();

  //initial state
  await expect(manageClinicPage.clinicFrame).toHaveScreenshot(
    "initial-clinic--page.png"
  );

  //edit clinic
  await manageClinicPage.clinicCombobox.click();
  await manageClinicPage.clinicItems.first().click();
  await expect(manageClinicPage.clinicFrame).toHaveScreenshot(
    "edit-clinic.png"
  );
});
