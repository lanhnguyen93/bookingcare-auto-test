import { faker } from "@faker-js/faker";
import path from "path";
import { getBase64, randomValue } from "../../utils/commonUtils";
import { Role } from "../../utils/types";

const _imagePath = path.resolve(__dirname, "./image-add-new.png");

export interface UserDataType {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phonenumber: string;
  gender: string;
  image: string;
  roleId: string;
  positionId: string;
}

export interface TestCreateUserDataType {
  user: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    phonenumber: string;
    gender: string;
    image: string;
    roleId: string;
    positionId: string;
  };
  message: string;
  titleTestcase: string;
}

export function randomUserData(role?: Role): UserDataType {
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
  let randomLastname = faker.person.lastName();
  let randomFirstname = faker.person.firstName();
  const user = {
    email: `${randomFirstname}${randomLastname}.${faker.number.int(
      1000
    )}@test.com`,
    firstName: randomFirstname,
    lastName: randomLastname,
    address: faker.location.city(),
    phonenumber: faker.phone.number(),
    gender: randomValue(["M", "F", "O"]),
    positionId: randomValue(["P0", "P1", "P2", "P3", "P4"]),
    roleId: roleId,
    password: process.env.CREATE_DATA_PASSWORD
      ? process.env.CREATE_DATA_PASSWORD
      : "",
    image: `data:image/png;base64, ${getBase64(_imagePath)}`,
  };
  return user;
}

export const testCreateUserData: TestCreateUserDataType[] = [
  {
    user: {
      ...randomUserData(),
      email: "",
    },
    message: "Missing required parameter!",
    titleTestcase: "fail without email",
  },
  {
    user: {
      ...randomUserData(),
      password: "",
    },
    message: "Missing required parameter!",
    titleTestcase: "fail without password",
  },
  {
    user: {
      ...randomUserData(),
      email: process.env.USER_EMAIL || "",
    },
    message: "The email is already in used!",
    titleTestcase: "fail with already email",
  },
];

export const emptyUserData = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phonenumber: "",
  address: "",
  gender: "",
  roleId: "",
  positionId: "",
  image: "",
};
