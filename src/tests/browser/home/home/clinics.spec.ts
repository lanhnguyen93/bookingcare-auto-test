import { test, expect } from "../../../../fixtures/base-test";
import { HomePage } from "../../../../pages/home/homePage";
import { getAllClinicsByApi } from "../../../../utils/doctorHelper";

test("should display clinic content correctly", async ({ page }) => {
  const clinics = await getAllClinicsByApi();
  // Go to Home Page
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.waitForLoad();

  // Verify clinic content
  await homePage.verifyClinicItems(clinics);
});
