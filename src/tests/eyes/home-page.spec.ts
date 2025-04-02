import { test } from "@applitools/eyes-playwright/fixture";
import { HomePage } from "../../pages/home/homePage";

test("home page", async ({ page, eyes }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.waitForLoad();

  /* Full page visual check */
  await eyes.check("Home page");

  /* Region visual check - header frame */
  await eyes.check("Add new user form", { region: homePage.headerFrame });

  /* Region visual check - footer frame */
  await eyes.check("Add new user form", { region: homePage.footerFrame });

  /* Region visual check - home ai frame */
  await eyes.check("Add new user form", { region: homePage.homeAiFrame });

  /* Region visual check - all services frame */
  await eyes.check("Add new user form", { region: homePage.allServicesFrame });

  /* Region visual check - specialty frame */
  await eyes.check("Add new user form", { region: homePage.specialtyFrame });

  /* Region visual check - clinic frame */
  await eyes.check("Add new user form", { region: homePage.clinicFrame });

  /* Region visual check - doctor frame */
  await eyes.check("Add new user form", { region: homePage.doctorFrame });

  /* Region visual check - live healthy frame */
  await eyes.check("Add new user form", { region: homePage.liveHealthyFrame });

  /* Region visual check - communication frame */
  await eyes.check("Add new user form", {
    region: homePage.communicationFrame,
  });
});
