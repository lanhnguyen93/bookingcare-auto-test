import { test, expect } from "../../../fixtures/auth-test";
import { NavigationBar } from "../../../pages/system/navigationBar";
import { UserVuexPage } from "../../../pages/system/userVuexPage";

test("navigation correctly", async ({ page }) => {
  const userVuexPage = new UserVuexPage(page);
  userVuexPage.goto();
  const navigationBar = new NavigationBar(page);

  await navigationBar.verifyUserDropdown();
  await navigationBar.verifyClinicButton();
  await navigationBar.verifySpecialtyButton();
  await navigationBar.verifyGreetingText();
  await navigationBar.verifyLanguageButton();
  await navigationBar.verifyLogoutButton();
});
