import { test, expect } from "../../../fixtures/auth-test";
import { UserVuexPage } from "../../../pages/system/userVuexPage";
import { NavigationBar } from "../../../pages/system/navigationBar";

test("logout successfully", async ({ page }) => {
  const navigationBar = new NavigationBar(page);
  await navigationBar.logoutButton.click();
  await expect(page).toHaveTitle("Login");

  const userVuexPage = new UserVuexPage(page);
  await userVuexPage.goto();
  expect(page.url()).toContain(`/login?redirect=${userVuexPage.pageUrl}`);
});
