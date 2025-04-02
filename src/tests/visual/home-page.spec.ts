import { expect, test } from "@playwright/test";
import { HomePage } from "../../pages/home/homePage";

test("should display layout correctly", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.waitForLoad();

  //header
  await expect(homePage.headerFrame).toHaveScreenshot("header-frame.png");
  await expect(homePage.footerFrame).toHaveScreenshot("footer-frame.png");
  await expect(homePage.homeAiFrame).toHaveScreenshot("home-ai-frame.png");
  await expect(homePage.allServicesFrame).toHaveScreenshot(
    "all-services-frame.png"
  );
  await expect(homePage.specialtyFrame).toHaveScreenshot("specialty-frame.png");
  await expect(homePage.clinicFrame).toHaveScreenshot("clinic-frame.png");
  await expect(homePage.doctorFrame).toHaveScreenshot("doctor-frame.png");
  await expect(homePage.liveHealthyFrame).toHaveScreenshot(
    "live-healthy-frame.png"
  );
  await expect(homePage.communicationFrame).toHaveScreenshot(
    "communication-frame.png"
  );
});
