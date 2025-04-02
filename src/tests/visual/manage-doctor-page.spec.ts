import { expect, test } from "../../fixtures/auth-test";
import { ManageDoctorInforPage } from "../../pages/system/manageDoctorInforPage";

test("manage doctor page", async ({ page }) => {
  const manageDoctorInforPage = new ManageDoctorInforPage(page);
  await manageDoctorInforPage.goto();
  await manageDoctorInforPage.waitForLoad();

  //initial state
  await expect(manageDoctorInforPage.doctorInforFrame).toHaveScreenshot(
    "initial-doctor-infor-page.png"
  );

  //add new doctor infor
  await manageDoctorInforPage.doctorCombobox.click();
  await manageDoctorInforPage.doctorItems
    .filter({ hasText: "Nguyen Doctor" })
    .click();
  await expect(manageDoctorInforPage.doctorInforFrame).toHaveScreenshot(
    "add-new-doctor-infor.png"
  );

  //edit doctor infor
  await manageDoctorInforPage.doctorCombobox.click();
  await manageDoctorInforPage.doctorItems.first().click();
  await expect(manageDoctorInforPage.doctorInforFrame).toHaveScreenshot(
    "edit-doctor-infor.png"
  );
});
