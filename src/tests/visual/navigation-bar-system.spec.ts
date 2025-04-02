import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/auth/loginPage";
import { NavigationBar } from "../../pages/system/navigationBar";
import { ManageSchedulePage } from "../../pages/system/manageSchedulePage";

test("navigation bar when admin user login", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.waitForLoad();
  await loginPage.enterCredential("admin@test.com", "123456");

  const navigationBar = new NavigationBar(page);
  await navigationBar.waitForLoad();
  await expect(navigationBar.headerFrame).toHaveScreenshot("admin-navibar.png");

  await navigationBar.userMenu.click();
  await expect(navigationBar.userDropdown).toHaveScreenshot(
    "admin-user-dropdown.png"
  );

  await navigationBar.languageMenu.click();
  await expect(navigationBar.languageDropdown).toHaveScreenshot(
    "admin-language-dropdown.png"
  );
});

test("navigation bar when doctor user login", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.waitForLoad();
  await loginPage.enterCredential("doctor@gmail.com", "123456");

  const manageSchedulePage = new ManageSchedulePage(page);
  await manageSchedulePage.waitForLoad();
  await expect(manageSchedulePage.headerFrame).toHaveScreenshot(
    "doctor-navibar.png"
  );

  await manageSchedulePage.userMenu.click();
  await expect(manageSchedulePage.userDropdown).toHaveScreenshot(
    "doctor-user-dropdown.png"
  );

  await manageSchedulePage.languageMenu.click();
  await expect(manageSchedulePage.languageDropdown).toHaveScreenshot(
    "doctor-language-dropdown.png"
  );
});
