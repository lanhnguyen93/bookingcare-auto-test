import { expect, test } from "@playwright/test";
import { DetailSpecialtyPage } from "../../pages/home/detailSpecialtyPage";

test("should display layout correctly", async ({ page }) => {
  const detailSpecialtyPage = new DetailSpecialtyPage(
    page,
    process.env.SPECIALTY_ID!
  );
  await detailSpecialtyPage.goto();
  await detailSpecialtyPage.waitForLoad();

  //initial state
  await expect(detailSpecialtyPage.specialtyFrame).toHaveScreenshot(
    "initial-specialty-frame.png"
  );
  await expect(detailSpecialtyPage.doctorFrame).toHaveScreenshot(
    "initial-doctor-frame.png"
  );

  //expand layout
  await detailSpecialtyPage.seeMoreButton.click();
  await expect(detailSpecialtyPage.specialtyFrame).toHaveScreenshot(
    "expand-specialty-frame.png"
  );
});
