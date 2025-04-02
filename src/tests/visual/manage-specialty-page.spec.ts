import { expect, test } from "../../fixtures/auth-test";
import { ManageSpecialtyPage } from "../../pages/system/manageSpecialtyPage";

test("should display layout correctly", async ({ page }) => {
  const manageSpecialtyPage = new ManageSpecialtyPage(page);
  await manageSpecialtyPage.goto();
  await manageSpecialtyPage.waitForLoad();

  //initial state
  await expect(manageSpecialtyPage.specialtyFrame).toHaveScreenshot(
    "initial-specialty-page.png"
  );

  //edit state
  await manageSpecialtyPage.specialtyCombobox.click();
  await manageSpecialtyPage.specialtyItems.first().click();
  await expect(manageSpecialtyPage.specialtyFrame).toHaveScreenshot(
    "edit-specialty-page.png"
  );
});
