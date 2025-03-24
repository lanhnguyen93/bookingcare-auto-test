import { test, expect } from "../../../fixtures/base-test";
import { api } from "../../../utils/api";
import { createUserByApi, deleteUserByApi } from "../../../utils/userHelper";

let token: string;
let adminUser: any;
let doctorUser: any;
let patientUser: any;

test.beforeAll(async ({ authToken }) => {
  token = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
  adminUser = await createUserByApi(token, "Admin");
  doctorUser = await createUserByApi(token, "Doctor");
  patientUser = await createUserByApi(token, "Patient");
});

test.afterAll(async () => {
  await deleteUserByApi(token, adminUser.id);
  await deleteUserByApi(token, doctorUser.id);
  await deleteUserByApi(token, patientUser.id);
});

test.describe("Login API with each user type", () => {
  test("should login successfully with admin user", async () => {
    const response = await api.post("/api/login", {
      email: adminUser.email,
      password: process.env.CREATE_DATA_PASSWORD,
    });

    let data = await response.data;

    expect(response.status).toBe(200);
    expect(data.errCode).toBe(0);
    expect(data).toHaveProperty("token");
    expect(data).toHaveProperty("userInfor");
    expect(data.userInfor).not.toHaveProperty("password");
  });

  test("should login successfully with doctor user", async () => {
    const response = await api.post("/api/login", {
      email: doctorUser.email,
      password: process.env.CREATE_DATA_PASSWORD,
    });

    let data = await response.data;

    expect(response.status).toBe(200);
    expect(data.errCode).toBe(0);
    expect(data).toHaveProperty("token");
    expect(data).toHaveProperty("userInfor");
    expect(data.userInfor).not.toHaveProperty("password");
  });

  test("should failt to login with patient user", async () => {
    const response = await api.post("/api/login", {
      email: patientUser.email,
      password: process.env.CREATE_DATA_PASSWORD,
    });

    let data = await response.data;

    expect(response.status).toBe(200);
    expect(data.errCode).toBe(3);
    expect(data.message).toBe("This email can't login to the system");
  });
});

test.describe("Verify case fail to login", () => {
  test("should fail to login with missing email", async () => {
    const response = await api.post("/api/login", {
      email: "",
      password: process.env.CREATE_DATA_PASSWORD,
    });

    expect(response.data.errCode).toBe(1);
    expect(response.data.message).toBe("Missing input parameter");
  });

  test("should fail to login with missing password", async () => {
    const response = await api.post("/api/login", {
      email: adminUser.email,
      password: "",
    });

    expect(response.data.errCode).toBe(1);
    expect(response.data.message).toBe("Missing input parameter");
  });

  test("should fail to login with non-existent email", async () => {
    const response = await api.post("/api/login", {
      email: "invalid email",
      password: process.env.CREATE_DATA_PASSWORD,
    });

    expect(response.data.errCode).toBe(2);
    expect(response.data.message).toBe("The email is not exits!");
  });

  test("should fail to login with wrong password", async () => {
    const response = await api.post("/api/login", {
      email: adminUser.email,
      password: "invalid password",
    });

    expect(response.data.errCode).toBe(4);
    expect(response.data.message).toBe("The password is not mapping!");
  });
});
