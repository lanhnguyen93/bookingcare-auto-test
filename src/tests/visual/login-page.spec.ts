import { expect, test } from "@playwright/test";
import { LoginPage } from "../../pages/auth/loginPage";

test("should display layout correctly", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.waitForLoad();

  //initial state
  await expect(loginPage.loginFrame).toHaveScreenshot("initial-login-page.png");

  //error state
  await loginPage.loginButton.click();
  await expect(loginPage.loginFrame).toHaveScreenshot("error-state.png");
});
