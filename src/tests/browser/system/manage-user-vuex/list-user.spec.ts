import { test } from "../../../../fixtures/auth-test";
import { UserVuexPage } from "../../../../pages/system/userVuexPage";

test("should display the list of user correctly", async ({ page }) => {
  const userVuexPage = new UserVuexPage(page);
  await userVuexPage.goto();
  await userVuexPage.waitForLoad();

  await userVuexPage.verifyRowsNumberInTable();
  await userVuexPage.verifyContentInEachRow();
  await userVuexPage.editIcons.isVisible;
  await userVuexPage.deleteIcons.isVisible;
});
