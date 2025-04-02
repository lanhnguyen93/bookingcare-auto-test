import { test } from "../../fixtures/auth-test";
import { UserVuexPage } from "../../pages/system/userVuexPage";

test("manage user page", async ({ page, eyes }) => {
  const userVuexPage = new UserVuexPage(page);
  await userVuexPage.goto();
  await userVuexPage.waitForLoad();

  /* Full page visual check */
  await eyes.check("Manage user page");

  /* Region visual check - input form when add new user */
  await eyes.check("Add new user form", { region: userVuexPage.inputFrame });

  /* Region visual check - input form when edit user */
  await userVuexPage.editIcons.first().click();
  await eyes.check("Edit user form", { region: userVuexPage.inputFrame });

  /* Region visual check - list user */
  await eyes.check("Edit user form", { region: userVuexPage.listFrame });
});
