import { faker } from "@faker-js/faker";
import { getAllcode, randomValue } from "../../utils/commonUtils";
import {
  getAllClinicsByApi,
  getAllSpecialtiesByApi,
} from "../../utils/doctorHelper";

export interface DoctorInforDataType {
  doctorId: string;
  priceId: string;
  paymentId: string;
  provinceId: string;
  clinicId: string;
  specialtyId: string;
  contentMarkdown: string;
  contentHTML: string;
  description: string;
  note: string;
}

export async function randomDoctorInforData(doctorId: string) {
  const prices = await getAllcode("PRICE");
  const payments = await getAllcode("PAYMENT");
  const description = faker.book.title();
  const clinics = await getAllClinicsByApi();
  const clinic = randomValue(clinics);
  const specialties = await getAllSpecialtiesByApi();
  let doctorInfor: DoctorInforDataType = {
    doctorId: doctorId,
    priceId: randomValue(prices).key,
    paymentId: randomValue(payments).key,
    provinceId: clinic.provinceId,
    clinicId: clinic.id,
    specialtyId: randomValue(specialties).id,
    contentMarkdown: `**${description}**`,
    contentHTML: `<p><strong>${description}</strong></p>`,
    description: faker.animal.cat(),
    note: faker.animal.dog(),
  };
  return doctorInfor;
}
