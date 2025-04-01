import { test, expect } from "../../../../fixtures/base-test";
import { DetailSpecialtyPage } from "../../../../pages/home/detailSpecialtyPage";
import { getAllcode } from "../../../../utils/commonUtils";
import { getDetailDoctorBySpecialtyIdAndProvinceIdByAPI } from "../../../../utils/doctorHelper";

test("should display doctors correctly by province", async ({ page }) => {
  const id = process.env.SPECIALTY_ID ? process.env.SPECIALTY_ID : "1";
  const provinces = await getAllcode("PROVINCE");
  const provinceKeys = ["ALL", ...provinces.map((province) => province.key)];
  const provinceValues = [
    "Toàn quốc",
    ...provinces.map((province) => province.valueVi),
  ];

  const detailSpecialtyPage = new DetailSpecialtyPage(page, id);
  // Go to Home Page
  await detailSpecialtyPage.goto();
  await detailSpecialtyPage.waitForLoad();

  //verify display select btn
  await detailSpecialtyPage.verifyDisplaySelectProvinceButton(
    provinceKeys,
    provinceValues
  );

  //verify filter doctor by province
  for (let j = 0; j < provinces.length; j++) {
    const doctors = await getDetailDoctorBySpecialtyIdAndProvinceIdByAPI(
      id,
      provinceKeys[j]
    );
    await detailSpecialtyPage.selectProvince.selectOption(provinceKeys[j]);
    await page.waitForTimeout(500);
    if (doctors) {
      await expect(detailSpecialtyPage.emptyText).toBeHidden;
      await expect(await detailSpecialtyPage.doctorInfors.count()).toBe(
        doctors.length
      );
    } else {
      await expect(detailSpecialtyPage.emptyText).toBeVisible;
    }
  }
});

test("should display doctor content correctly", async ({ page }) => {
  const id = process.env.SPECIALTY_ID ? process.env.SPECIALTY_ID : "1";

  // Go to Home Page
  const detailSpecialtyPage = new DetailSpecialtyPage(page, id);
  await detailSpecialtyPage.goto();
  await detailSpecialtyPage.waitForLoad();
});
