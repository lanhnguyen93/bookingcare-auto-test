import { expect, test } from "../../../../fixtures/base-test";
import { DetailDoctorPage } from "../../../../pages/home/detailDoctorPage";
import { getDetailDoctorByDoctorIdByApi } from "../../../../utils/doctorHelper";

test("should display common doctor infor correctly", async ({ page }) => {
  const doctorId = process.env.DOCTOR_ID ? process.env.DOCTOR_ID : "3";
  const doctorInfor = await getDetailDoctorByDoctorIdByApi(doctorId);

  const detailDoctorPage = new DetailDoctorPage(page, doctorId);
  await detailDoctorPage.goto();
  await detailDoctorPage.waitForLoad();

  //verify doctor infor: title, address, image
  await detailDoctorPage.verifyDoctorInfor(doctorId);

  //verify doctor description
  await expect(detailDoctorPage.doctorDescription).toHaveText(
    doctorInfor.description
  );

  //verify introduction content
  await detailDoctorPage.verifyIntroContent(doctorInfor.contentHTML);
});

test("should display booking infor correctly", async ({ page }) => {
  const doctorId = process.env.DOCTOR_ID ? process.env.DOCTOR_ID : "3";
  const doctorInfor = await getDetailDoctorByDoctorIdByApi(doctorId);

  const detailDoctorPage = new DetailDoctorPage(page, doctorId);
  await detailDoctorPage.goto();
  await detailDoctorPage.waitForLoad();

  // verify clinic infor
  await detailDoctorPage.verifyClinicContent(doctorInfor.clinicData);

  // verify payment infor
  await expect(detailDoctorPage.payment).toHaveText(
    doctorInfor.paymentData.valueVi
  );

  // verify price infor
  await detailDoctorPage.verifyPriceContent(doctorInfor.priceData);
});
