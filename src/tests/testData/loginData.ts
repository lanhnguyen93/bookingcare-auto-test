export interface TestLoginDataType {
  email: string;
  password: string;
  message: string;
}

export const testLoginData: TestLoginDataType[] = [
  {
    email: "",
    password: process.env.USER_PASSWORD!,
    message: "Missing input parameter",
  },
  {
    email: process.env.USER_EMAIL!,
    password: "",
    message: "Missing input parameter",
  },
  {
    email: "nonexistent@test.com",
    password: process.env.USER_PASSWORD!,
    message: "The email is not exits!",
  },
  {
    email: process.env.USER_EMAIL!,
    password: "wrongPassword",
    message: "The password is not mapping!",
  },
];
