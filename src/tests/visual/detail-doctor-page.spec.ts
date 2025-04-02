import { expect, test } from "@playwright/test";
import { DetailDoctorPage } from "../../pages/home/detailDoctorPage";

test("should display layout correctly", async ({ page }) => {
  const detailDoctorPage = new DetailDoctorPage(page, process.env.DOCTOR_ID!);
  await detailDoctorPage.goto();
  await detailDoctorPage.waitForLoad();

  //initial state
  await expect(detailDoctorPage.detailDoctorFrame).toHaveScreenshot(
    "initial-detail-doctor-page.png"
  );

  //detail payment infor
  await detailDoctorPage.seeMoreButton.click();
  await expect(detailDoctorPage.detailPaymentFrame).toHaveScreenshot(
    "detail-payment-infor.png"
  );
});
