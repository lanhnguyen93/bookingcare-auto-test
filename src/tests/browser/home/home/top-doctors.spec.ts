import { test, expect } from "../../../../fixtures/base-test";
import { HomePage } from "../../../../pages/home/homePage";
import { getTopDoctorByApi } from "../../../../utils/doctorHelper";

test("should display top doctor content correctly", async ({ page }) => {
  const topDoctors = await getTopDoctorByApi();
  // Go to Home Page
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.waitForLoad();
  await homePage.doctorsFrame.scrollIntoViewIfNeeded();

  // Verify number of top doctor items
  await homePage.verifyTopDoctorsItems(topDoctors);
});
