import { test, expect } from "../../../../fixtures/base-test";
import { DetailSpecialtyPage } from "../../../../pages/home/detailSpecialtyPage";
import { getAllSpecialtiesByApi } from "../../../../utils/doctorHelper";

test("should display specialty infor correctly", async ({ page }) => {
  const specialties = await getAllSpecialtiesByApi();
  for (let i = 0; i < specialties.length; i++) {
    const detailSpecialtyPage = new DetailSpecialtyPage(
      page,
      specialties[i].id
    );
    // Go to Home Page
    await detailSpecialtyPage.goto();
    await detailSpecialtyPage.waitForLoad();

    await detailSpecialtyPage.verifySpecialtyTitle(specialties[i].id);
    await detailSpecialtyPage.verifyTrimmingContent();
    await detailSpecialtyPage.verifyHTMLContent(specialties[i].id);
  }
});
