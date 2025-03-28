import { expect, test } from "../../../../fixtures/auth-test";
import { ManageSchedulePage } from "../../../../pages/system/manageSchedulePage";
import { getAllDoctorByApi } from "../../../../utils/doctorHelper";

test("should be data displayed correctly", async ({ page }) => {
  const doctors = await getAllDoctorByApi();

  // Go to the Magage Schedule Page
  const manageSchedulePage = new ManageSchedulePage(page);
  await manageSchedulePage.goto();
  await manageSchedulePage.waitForLoad();

  // Verify initial state
  await expect(await manageSchedulePage.isEmptyForm()).toBeTruthy();

  // Verify doctors list
  await manageSchedulePage.doctorCombobox.click();
  await manageSchedulePage.verifyContentInDoctorList(doctors);

  // Verify timeblocks
  await manageSchedulePage.verifyTimeblockItems();
});
