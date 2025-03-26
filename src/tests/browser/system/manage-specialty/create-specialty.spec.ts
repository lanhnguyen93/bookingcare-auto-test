import { expect, test } from "../../../../fixtures/auth-test";
import { SpecialtyPage } from "../../../../pages/system/specialtyPage";

test("checkly", async ({ page }) => {
  const specialtyPage = new SpecialtyPage(page);
  await specialtyPage.goto();
  await specialtyPage.waitForLoad();
});


/**
 * Check initial state
 * Create successfully -> clear form, user
 * Fail to create
 */