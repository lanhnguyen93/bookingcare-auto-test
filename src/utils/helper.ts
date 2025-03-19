import { faker } from "@faker-js/faker";
import fs from "fs";

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

function randomValue(array: string[]) {
  return array[Math.floor(Math.random() * array.length)];
}
