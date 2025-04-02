import { expect, test } from "../../fixtures/auth-test";
import { UserVuexPage } from "../../pages/system/userVuexPage";

test("Should display layout correctly", async ({ page }) => {
  const userVuexPage = new UserVuexPage(page);
  await userVuexPage.goto();
  await userVuexPage.waitForLoad();

  await expect(userVuexPage.inputFrame).toHaveScreenshot(
    "add-new-user-form.png"
  );

  await userVuexPage.editIcons.first().click();
  await expect(userVuexPage.inputFrame).toHaveScreenshot("edit-user-form.png");

  await expect(userVuexPage.listFrame).toHaveScreenshot("list-user-table.png");
});
