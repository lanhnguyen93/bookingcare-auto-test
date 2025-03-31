import { test, expect } from "../../../../fixtures/base-test";
import { HomePage } from "../../../../pages/home/homePage";
import { getAllSpecialtiesByApi } from "../../../../utils/doctorHelper";

test("should display specialites content correctly", async ({ page }) => {
  const specialites = await getAllSpecialtiesByApi();
  // Go to Home Page
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.waitForLoad();

  // Verify number of specialty items
  await homePage.verifySpecialtyItems(specialites);
});
