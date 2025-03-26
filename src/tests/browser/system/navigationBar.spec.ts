import { test } from "../../../fixtures/auth-test";
import { NavigationBar } from "../../../pages/system/navigationBar";

test("navigation correctly", async ({ page }) => {
  const navigationBar = new NavigationBar(page);
  navigationBar.goto();
  navigationBar.waitForLoad();

  await navigationBar.verifyUserDropdown();
  await navigationBar.verifyClinicButton();
  await navigationBar.verifySpecialtyButton();
  await navigationBar.verifyGreetingText();
  await navigationBar.verifyLanguageButton();
  await navigationBar.verifyLogoutButton();
});
