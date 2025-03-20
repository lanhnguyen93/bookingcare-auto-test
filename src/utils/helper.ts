import { faker } from "@faker-js/faker";
import fs from "fs";
import axios from "axios";
import path from "path";

type Specialty = {
  id?: string;
  name: string;
  image: string;
  descriptionMarkdown: string;
  descriptionHTML: string;
};

type Clinic = {
  id?: string;
  name: string;
  address: string;
  descriptionMarkdown: string;
  descriptionHTML: string;
  provinceId: string;
  image: string;
};

const _imagePath = path.resolve(
  __dirname,
  "../tests/api/testData/image-test.png"
);

export function createRandomUserInfor(role?: string) {
  let randomLastname = faker.person.lastName();
  let randomFirstname = faker.person.firstName();
  let randomEmail = `${randomFirstname}${randomLastname}.${faker.number.int(
    1000
  )}@test.com`;
  let randomPhonenumber = faker.phone.number();
  let randomAddress = faker.location.city();
  let randomGenderId = randomValue(["M", "F", "O"]);
  let randomPositionId = randomValue(["P0", "P1", "P2", "P3", "P4"]);
  let roleId = "";
  switch (role) {
    case "Admin":
      roleId = "R1";
      break;
    case "Doctor":
      roleId = "R2";
      break;
    case "Patient":
      roleId = "R3";
      break;
    default:
      roleId = "R1";
  }

  const user = {
    email: randomEmail,
    firstName: randomFirstname,
    lastName: randomLastname,
    address: randomAddress,
    phonenumber: randomPhonenumber,
    gender: randomGenderId,
    roleId: roleId,
    positionId: randomPositionId,
    password: "123456",
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
  let specialty: Specialty = response.data.specialty;
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
  let clinic: Clinic = response.data.clinic;
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

function randomValue(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}
