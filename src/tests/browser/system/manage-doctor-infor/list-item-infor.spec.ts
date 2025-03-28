import { expect, test } from "../../../../fixtures/auth-test";
import { ManageDoctorInforPage } from "../../../../pages/system/manageDoctorInforPage";
import { getAllcode } from "../../../../utils/commonUtils";
import {
  getAllClinicsByApi,
  getAllDoctorByApi,
  getAllSpecialtiesByApi,
} from "../../../../utils/doctorHelper";

test("should display the list of combobox correctly", async ({ page }) => {
  const doctors = await getAllDoctorByApi();
  const clinics = await getAllClinicsByApi();
  const specialties = await getAllSpecialtiesByApi();
  const prices = await getAllcode("PRICE");
  const payments = await getAllcode("PAYMENT");
  // Go to the Magage Doctor Infor Page
  const manageDoctorInforPage = new ManageDoctorInforPage(page);
  await manageDoctorInforPage.goto();
  await manageDoctorInforPage.waitForLoad();

  //Verify specialty list
  await manageDoctorInforPage.specialtyCombobox.click();
  await manageDoctorInforPage.verifyContentInSpecialtyList(specialties);

  //Verify clinics list
  await manageDoctorInforPage.clinicCombobox.click();
  await manageDoctorInforPage.verifyContentInClinicList(clinics);

  //Verify price list
  await manageDoctorInforPage.priceCombobox.click();
  await manageDoctorInforPage.verifyPriceContentInList(prices);

  //Verify payment list
  await manageDoctorInforPage.paymentCombobox.click();
  await manageDoctorInforPage.verifyPaymentContentInList(payments);

  // Verify doctors list
  await manageDoctorInforPage.doctorCombobox.click();
  await manageDoctorInforPage.verifyContentInDoctorList(doctors);
});

test("should the form be filled when selecting a doctor", async ({ page }) => {
  const doctors = await getAllDoctorByApi();
  // Go to the Magage Doctor Infor Page
  const manageDoctorInforPage = new ManageDoctorInforPage(page);
  await manageDoctorInforPage.goto();
  await manageDoctorInforPage.waitForLoad();

  // Verify initial state
  await expect(await manageDoctorInforPage.isEmptyForm()).toBeTruthy();

  //   Choose a doctor and verify input form
  await manageDoctorInforPage.doctorCombobox.click();
  await manageDoctorInforPage.doctorItems.first().click();
  await manageDoctorInforPage.verifyFormByDoctorId(doctors[0].id);

  await manageDoctorInforPage.doctorCombobox.click();
  await manageDoctorInforPage.doctorItems.nth(1).click();
  await manageDoctorInforPage.verifyFormByDoctorId(doctors[1].id);
  await manageDoctorInforPage.doctorClearButton.click();
  await expect(await manageDoctorInforPage.isEmptyForm()).toBeTruthy();
});
