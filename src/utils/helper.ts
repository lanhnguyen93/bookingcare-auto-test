import { faker } from "@faker-js/faker";
import fs from "fs";
import axios from "axios";
import path from "path";
import * as Types from "./typesBase";

const _imagePath = path.resolve(
  __dirname,
  "../tests/api/testData/image-test.png"
);

export async function createUser(token: string, role?: string) {
  const randomUser = createRandomUserInfor(role);
  const response = await axios.post(
    `${process.env.SERVER_URL}/api/create-new-user`,
    randomUser,
    { headers: { Authorization: token } }
  );
  let user = await response.data.user;
  return user;
}

export function createRandomUserInfor(role?: string) {
  let randomLastname = faker.person.lastName();
  let randomFirstname = faker.person.firstName();
  let roleId: string;
  switch (role?.toLocaleLowerCase()) {
    case "admin":
      roleId = "R1";
      break;
    case "doctor":
      roleId = "R2";
      break;
    case "patient":
      roleId = "R3";
      break;
    default:
      roleId = "R1";
  }
  const user = {
    email: `${randomFirstname}${randomLastname}.${faker.number.int(
      1000
    )}@test.com`,
    firstName: randomFirstname,
    lastName: randomLastname,
    address: faker.location.city(),
    phonenumber: faker.phone.number(),
    gender: randomValue(["M", "F", "O"]),
    roleId: roleId,
    // dont use positionId when creating user
    // positionId: randomValue(["P0", "P1", "P2", "P3", "P4"]),
    password: "123456",
    image: `data:image/png;base64, ${getImageBase64(_imagePath)}`,
  };
  const userFile = "src/tests/api/testData/randomUser.json";
  fs.writeFileSync(userFile, JSON.stringify(user));
  return user;
}

export function getImageBase64(filePath: string): string {
  const imageBuffer = fs.readFileSync(filePath);
  return imageBuffer.toString("base64");
}

export function convertToBase64(bufferData: string) {
  const base64 = Buffer.from(bufferData).toString("utf-8");
  return base64;
}

export async function createSpecialty(token: string) {
  const specialtyInfor = createRandomSpecialtyInfor();
  const response = await axios.post(
    `${process.env.SERVER_URL}/api/create-specialty`,
    specialtyInfor,
    { headers: { Authorization: token } }
  );
  let specialty: Types.Specialty = response.data.specialty;
  return specialty;
}

export function createRandomSpecialtyInfor(imagePath?: string) {
  if (!imagePath) {
    imagePath = _imagePath;
  }
  const description = faker.book.title();
  let specialty = {
    name: `Specialty Name Test1 - ${faker.number.int(1000)}`,
    image: `data:image/png;base64, ${getImageBase64(imagePath)}`,
    descriptionMarkdown: `**${description}**`,
    descriptionHTML: `<p><strong>${description}</strong></p>`,
  };
  return specialty;
}

export async function createClinic(token: string) {
  const clinicInfor = await createRandomClinicInfor();
  const response = await axios.post(
    `${process.env.SERVER_URL}/api/create-clinic`,
    clinicInfor,
    { headers: { Authorization: token } }
  );
  let clinic: Types.Clinic = response.data.clinic;
  return clinic;
}

export async function createRandomClinicInfor(imagePath?: string) {
  if (!imagePath) {
    imagePath = _imagePath;
  }
  const provinces = await getAllcode("PROVINCE");
  const description = faker.book.title();
  let clinic = {
    name: `Clinic Name Test - ${faker.number.int(1000)}`,
    address: faker.location.city(),
    descriptionMarkdown: `**${description}**`,
    descriptionHTML: `<p><strong>${description}</strong></p>`,
    provinceId: randomValue(provinces).key,
    image: `data:image/png;base64, ${getImageBase64(imagePath)}`,
  };
  return clinic;
}

export async function createRandomDoctorInfor() {
  const prices = await getAllcode("PRICE");
  const payments = await getAllcode("PAYMENT");
  const description = faker.book.title();
  const clinics = await getAllClinics();
  const clinic = randomValue(clinics);
  const specialties = await getAllSpecialties();
  let doctorInfor: Types.DoctorInfor = {
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

export async function createRandomSchedule(doctorId: string, _date?: string) {
  let date: string = _date ? _date : getRandomDateWithin7Days();
  const timeTypes = await getAllcode("TIME");
  const randomTimetypes = getRandomElements(timeTypes);

  const schedule = randomTimetypes.map((timeType) => ({
    doctorId: doctorId,
    date: date,
    timeType: timeType.key,
  }));

  return schedule;
}

export async function createRandomBookingInfor() {
  let randomFullname = faker.person.fullName();
  const booking: Types.Booking = {
    email: `${randomFullname}.${faker.number.int(1000)}@test.com`,
    // email: "testviewpoint93@gmail.com",
    // firstName: "Lanh Nguyen",
    firstName: randomFullname,
    lang: randomValue(["vi", "en"]),
    phonenumber: faker.phone.number(),
    reason: faker.book.title(),
    address: faker.location.city(),
  };
  return booking;
}

/**
 * The function to get values in db such as: role of user, status booking, time for booking, position of user..
 * @param inputType included ROLE, STATUS, TIME, POSITION, GENDER, PRICE, PAYMENT, PROVINCE
 */
export async function getAllcode(inputType: string) {
  const response = await axios.get(
    `${process.env.SERVER_URL}/api/allcode?type=${inputType}`
  );
  let data = response.data;
  return data.data;
}

export async function getAllClinics() {
  const response = await axios.get(
    `${process.env.SERVER_URL}/api/get-all-clinics`,
    { params: { id: "ALL" } }
  );
  let data = response.data;
  return data.clinics;
}

export async function getAllSpecialties() {
  const response = await axios.get(
    `${process.env.SERVER_URL}/api/get-all-specialty`,
    { params: { id: "ALL" } }
  );
  let data = response.data;
  return data.specialties;
}

function randomValue(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomDateWithin7Days(): string {
  const today = new Date();
  const randomDays = Math.floor(Math.random() * 8);
  const randomDate = new Date(today);
  randomDate.setDate(today.getDate() + randomDays);
  const formattedDate = randomDate.toISOString().split("T")[0];
  return formattedDate;
}

function getRandomElements(array: any[]) {
  const count = Math.floor(Math.random() * array.length) + 1;
  const shuffled = [...array].sort(() => 0.5 - Math.random()); // Trộn ngẫu nhiên mảng
  return shuffled.slice(0, count); // Lấy `count` phần tử đầu tiên
}
