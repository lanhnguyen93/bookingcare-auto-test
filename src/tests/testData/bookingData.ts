import { faker } from "@faker-js/faker";
import { randomValue } from "../../utils/commonUtils";

export interface BookingDataType {
  doctorId: string;
  date: string;
  timeType: string;
  email: string;
  firstName: string;
  phonenumber: string;
  address: string;
  reason: string;
  doctorName: string;
  price: string;
  time: string;
  lang: string;
}

export interface ConfirmBookingDataType {
  id: string;
  email: string;
  file: string;
  fullname: string;
  lang: string;
}

export async function randomBookingData(
  doctorId: string,
  date: string,
  timeType: string
) {
  let randomFullname = faker.person.fullName();
  const booking: BookingDataType = {
    doctorId: doctorId,
    date: date,
    timeType: timeType,
    email: `${randomFullname}.${faker.number.int(1000)}@test.com`,
    // email: "testviewpoint93@gmail.com",
    // firstName: "Lanh Nguyen",
    firstName: randomFullname,
    phonenumber: faker.phone.number(),
    address: faker.location.city(),
    reason: faker.book.title(),
    doctorName: "fake - doctor name", //handle client side
    price: "fake data 200.000 VND", //handle client side
    time: "fake data 10:00 - 11:00", //handle client side
    lang: randomValue(["vi", "en"]), //handle client side
  };
  return booking;
}
