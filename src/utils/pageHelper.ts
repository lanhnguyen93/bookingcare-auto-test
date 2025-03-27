import { Page, expect } from "@playwright/test";

export async function verifyAlertMessage(page: Page, expectedMessage: string) {
  page.once("dialog", async (dialog) => {
    await expect(await dialog.message()).toBe(expectedMessage);
    await dialog.accept();
  });
}
