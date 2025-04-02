import { expect, test } from "../../fixtures/auth-test";
import { ManageSchedulePage } from "../../pages/system/manageSchedulePage";

test("manage schedule page", async ({ page }) => {
  const manageSchedulePage = new ManageSchedulePage(page);
  await manageSchedulePage.goto();
  await manageSchedulePage.waitForLoad();

  //initial state
  await expect(manageSchedulePage.scheduleFrame).toHaveScreenshot(
    "initial-schedule-page.png"
  );

  //hover timeblock
  await manageSchedulePage.timeBlockItems.first().hover();
  await expect(manageSchedulePage.timeBlockItems.first()).toHaveScreenshot(
    "hover-time-block.png"
  );

  //select timeblock
  await manageSchedulePage.timeBlockItems.first().click();
  await expect(manageSchedulePage.timeBlockItems.first()).toHaveScreenshot(
    "selected-time-block.png"
  );
});
